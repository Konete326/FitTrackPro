const User = require('../Models/User_Model');
const Workout = require('../Models/Workout_Model');
const Notification = require('../Models/Notification_Model');

const getAllUsers = async (req, res, next) => {
  try {
    const { role, isActive, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (role) filter.Role = role;
    if (isActive !== undefined) filter.IsActive = isActive === 'true';
    if (search) filter.$or = [{ Username: { $regex: search, $options: 'i' } }, { Email: { $regex: search, $options: 'i' } }];
    const total = await User.countDocuments(filter);
    const data = await User.find(filter).skip((page - 1) * limit).limit(Math.min(parseInt(limit), 50)).lean();
    res.status(200).json({ success: true, count: data.length, total, data });
  } catch (error) { next(error); }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, user });
  } catch (error) { next(error); }
};

const createUser = async (req, res, next) => {
  try {
    const user = await User.create({ ...req.body, IsVerified: true });
    res.status(201).json({ success: true, user: user.getSafeUser() });
  } catch (error) { next(error); }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, user: user.getSafeUser() });
  } catch (error) { next(error); }
};

const toggleUserActive = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.IsActive = !user.IsActive;
    await user.save({ validateBeforeSave: false });
    res.status(200).json({ success: true, user: user.getSafeUser() });
  } catch (error) { next(error); }
};

const assignTrainer = async (req, res, next) => {
  try {
    const { userId, trainerId } = req.params;
    const user = await User.findByIdAndUpdate(userId, { TrainerId: trainerId }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    await Notification.create({ UserId: userId, Type: 'System', Title: 'Trainer Assigned', Message: 'A trainer has been assigned to you.' });
    await Notification.create({ UserId: trainerId, Type: 'System', Title: 'New Client', Message: 'A new client has been assigned to you.' });
    res.status(200).json({ success: true, user: user.getSafeUser() });
  } catch (error) { next(error); }
};

const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Workout.deleteMany({ UserId: req.params.id });
    await Notification.deleteMany({ UserId: req.params.id });
    res.status(200).json({ success: true, message: 'User and associated data deleted' });
  } catch (error) { next(error); }
};

const getSystemStats = async (req, res, next) => {
  try {
    const [users, trainers, workouts] = await Promise.all([
      User.countDocuments({ Role: 'User' }),
      User.countDocuments({ Role: 'Trainer' }),
      Workout.countDocuments(),
    ]);
    res.status(200).json({ success: true, data: { users, trainers, workouts } });
  } catch (error) { next(error); }
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, toggleUserActive, assignTrainer, deleteUser, getSystemStats };
