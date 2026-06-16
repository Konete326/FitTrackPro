const TrainerRequest = require('../Models/TrainerRequest_Model');
const User = require('../Models/User_Model');
const Notification = require('../Models/Notification_Model');

const createRequest = async (req, res, next) => {
  try {
    const request = await TrainerRequest.create({ ...req.body, UserId: req.user._id });
    await Notification.create({ UserId: req.body.TrainerId, Type: 'System', Title: 'New Trainer Request', Message: `${req.user.Profile.Name} wants you as their trainer.` });
    res.status(201).json({ success: true, data: request });
  } catch (error) { next(error); }
};

const getAllRequests = async (req, res, next) => {
  try {
    const data = await TrainerRequest.find().populate('UserId', 'Username Profile.Name Profile.ProfilePicture').populate('TrainerId', 'Username Profile.Name').sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) { next(error); }
};

const updateRequestStatus = async (req, res, next) => {
  try {
    const request = await TrainerRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    request.Status = req.body.Status;
    request.AdminNotes = req.body.AdminNotes;
    await request.save();
    if (req.body.Status === 'Approved') {
      await User.findByIdAndUpdate(request.UserId, { TrainerId: request.TrainerId });
      await Notification.create({ UserId: request.UserId, Type: 'System', Title: 'Trainer Approved', Message: 'Your trainer request has been approved.' });
    }
    res.status(200).json({ success: true, data: request });
  } catch (error) { next(error); }
};

const getAvailableTrainers = async (req, res, next) => {
  try {
    const trainers = await User.find({ Role: 'Trainer', IsActive: true }).select('Username Profile.Name Profile.ProfilePicture Stats').lean();
    res.status(200).json({ success: true, count: trainers.length, data: trainers });
  } catch (error) { next(error); }
};

module.exports = { createRequest, getAllRequests, updateRequestStatus, getAvailableTrainers };
