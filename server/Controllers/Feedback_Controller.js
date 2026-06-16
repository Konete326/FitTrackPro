const Feedback = require('../Models/Feedback_Model');
const Notification = require('../Models/Notification_Model');
const User = require('../Models/User_Model');

const submitFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.create({ ...req.body, UserId: req.user._id, Name: req.user.Profile.Name, Email: req.user.Email });
    const admins = await User.find({ Role: 'Admin' }).select('_id');
    const adminNotifications = admins.map(admin =>
      Notification.create({ UserId: admin._id, Type: 'Feedback', Title: 'New Feedback', Message: `${req.user.Profile.Name} submitted feedback.` })
    );
    await Promise.all(adminNotifications);
    res.status(201).json({ success: true, data: feedback });
  } catch (error) { next(error); }
};

const getAllFeedbacks = async (req, res, next) => {
  try {
    const data = await Feedback.find().populate('UserId', 'Username Profile.Name').sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) { next(error); }
};

const markAsRead = async (req, res, next) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(req.params.id, { IsRead: true }, { new: true });
    if (!feedback) return res.status(404).json({ success: false, message: 'Feedback not found' });
    await Notification.create({ UserId: feedback.UserId, Type: 'Feedback', Title: 'Feedback Processed', Message: 'Your feedback has been reviewed by admin.' });
    res.status(200).json({ success: true, data: feedback });
  } catch (error) { next(error); }
};

module.exports = { submitFeedback, getAllFeedbacks, markAsRead };
