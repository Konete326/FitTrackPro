const User = require('../Models/User_Model');
const Workout = require('../Models/Workout_Model');
const Goal = require('../Models/Goal_Model');
const Notification = require('../Models/Notification_Model');

const getClients = async (req, res, next) => {
  try {
    const clients = await User.find({ TrainerId: req.user._id }).lean();
    res.status(200).json({ success: true, count: clients.length, data: clients });
  } catch (error) { next(error); }
};

const getClientDetails = async (req, res, next) => {
  try {
    const client = await User.findById(req.params.id);
    if (!client || client.TrainerId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    res.status(200).json({ success: true, data: client });
  } catch (error) { next(error); }
};

const assignWorkout = async (req, res, next) => {
  try {
    const client = await User.findById(req.params.id);
    if (!client || client.TrainerId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    const workout = await Workout.create({ ...req.body, UserId: client._id });
    await Notification.create({ UserId: client._id, Type: 'Workout', Title: 'New Workout Assigned', Message: `Your trainer assigned "${workout.Title}".`, Link: '/workouts' });
    res.status(201).json({ success: true, data: workout });
  } catch (error) { next(error); }
};

const setClientGoal = async (req, res, next) => {
  try {
    const client = await User.findById(req.params.id);
    if (!client || client.TrainerId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    const goal = await Goal.create({ ...req.body, UserId: client._id });
    await Notification.create({ UserId: client._id, Type: 'Goal', Title: 'New Goal Set', Message: `Your trainer set a goal: "${goal.Title}".`, Link: '/goals' });
    res.status(201).json({ success: true, data: goal });
  } catch (error) { next(error); }
};

const addClientNote = async (req, res, next) => {
  try {
    const client = await User.findById(req.params.id);
    if (!client || client.TrainerId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    client.TrainerNotes.push({ TrainerId: req.user._id, TrainerName: req.user.Profile.Name, Note: req.body.note });
    await client.save({ validateBeforeSave: false });
    res.status(200).json({ success: true, data: client });
  } catch (error) { next(error); }
};

const sendMessageToClient = async (req, res, next) => {
  try {
    const client = await User.findById(req.params.id);
    if (!client || client.TrainerId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    await Notification.create({ UserId: client._id, Type: 'Message', Title: 'Message from Trainer', Message: req.body.message, Data: { trainerName: req.user.Profile.Name }, Link: '/dashboard' });
    res.status(201).json({ success: true, message: 'Message sent' });
  } catch (error) { next(error); }
};

const removeClient = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { TrainerId: null });
    await Notification.create({ UserId: req.params.id, Type: 'System', Title: 'Trainer Removed', Message: 'Your trainer assignment has been removed.', Link: '/browse-trainers' });
    res.status(200).json({ success: true, message: 'Client removed' });
  } catch (error) { next(error); }
};

const createWorkoutTemplate = async (req, res, next) => {
  try {
    const template = await Workout.create({ ...req.body, UserId: req.user._id, IsTemplate: true });
    res.status(201).json({ success: true, data: template });
  } catch (error) { next(error); }
};

const getWorkoutTemplates = async (req, res, next) => {
  try {
    const data = await Workout.find({ UserId: req.user._id, IsTemplate: true }).sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) { next(error); }
};

const deleteWorkoutTemplate = async (req, res, next) => {
  try {
    await Workout.findOneAndDelete({ _id: req.params.id, UserId: req.user._id, IsTemplate: true });
    res.status(200).json({ success: true, message: 'Template deleted' });
  } catch (error) { next(error); }
};

const getTrainerDashboardStats = async (req, res, next) => {
  try {
    const totalClients = await User.countDocuments({ TrainerId: req.user._id });
    const assignedWorkouts = await Workout.countDocuments({ UserId: { $in: (await User.find({ TrainerId: req.user._id }).select('_id')).map(u => u._id) } });
    res.status(200).json({ success: true, data: { totalClients, assignedWorkouts } });
  } catch (error) { next(error); }
};

module.exports = { getClients, getClientDetails, assignWorkout, setClientGoal, addClientNote, sendMessageToClient, removeClient, createWorkoutTemplate, getWorkoutTemplates, deleteWorkoutTemplate, getTrainerDashboardStats };
