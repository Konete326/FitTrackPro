const TrainerRequest = require('../Models/TrainerRequest_Model');
const User = require('../Models/User_Model');
const Notification = require('../Models/Notification_Model');

const createRequest = async (req, res, next) => {
  try {
    const request = await TrainerRequest.create({ ...req.body, UserId: req.user._id });
    await Notification.create({ UserId: req.body.TrainerId, Type: 'System', Title: 'New Trainer Request', Message: `${req.user.Profile.Name} wants you as their trainer.`, Link: '/trainer/clients' });
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
      await Notification.create({ UserId: request.UserId, Type: 'System', Title: 'Trainer Approved', Message: 'Your trainer request has been approved.', Link: '/browse-trainers' });
    }
    res.status(200).json({ success: true, data: request });
  } catch (error) { next(error); }
};

const getMyRequests = async (req, res, next) => {
  try {
    const data = await TrainerRequest.find({ UserId: req.user._id })
      .populate('TrainerId', 'Username Profile.Name Profile.ProfilePicture Stats')
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) { next(error); }
};

const getAvailableTrainers = async (req, res, next) => {
  try {
    const trainers = await User.find({ Role: 'Trainer', IsActive: true }).select('Username Profile.Name Profile.ProfilePicture Profile.Bio Profile.Specialties Profile.Experience Stats').lean();
    res.status(200).json({ success: true, count: trainers.length, data: trainers });
  } catch (error) { next(error); }
};

const removeTrainer = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.TrainerId) return res.status(400).json({ success: false, message: 'No trainer assigned' });
    const trainerId = user.TrainerId;
    user.TrainerId = null;
    await user.save();
    await Notification.create({ UserId: trainerId, Type: 'System', Title: 'Client Unassigned', Message: `${user.Profile?.Name || user.Username} has been removed from your clients.`, Link: '/trainer/clients' });
    res.status(200).json({ success: true, message: 'Trainer removed successfully' });
  } catch (error) { next(error); }
};

module.exports = { createRequest, getAllRequests, updateRequestStatus, getAvailableTrainers, getMyRequests, removeTrainer };
