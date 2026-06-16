const Workout = require('../Models/Workout_Model');
const Notification = require('../Models/Notification_Model');

const createWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.create({ ...req.body, UserId: req.user._id });
    await Notification.create({ UserId: req.user._id, Type: 'Workout', Title: 'Workout Created', Message: `"${workout.Title}" has been added to your workouts.` });
    res.status(201).json({ success: true, data: workout });
  } catch (error) { next(error); }
};

const getWorkouts = async (req, res, next) => {
  try {
    const { type, status, startDate, endDate, page = 1, limit = 20 } = req.query;
    const filter = { UserId: req.user._id };
    if (type) filter.Type = type;
    if (status) filter.Status = status;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    const total = await Workout.countDocuments(filter);
    const data = await Workout.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Math.min(parseInt(limit), 50)).lean();
    res.status(200).json({ success: true, count: data.length, total, data });
  } catch (error) { next(error); }
};

const getWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, UserId: req.user._id });
    if (!workout) return res.status(404).json({ success: false, message: 'Workout not found' });
    res.status(200).json({ success: true, data: workout });
  } catch (error) { next(error); }
};

const updateWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findOneAndUpdate({ _id: req.params.id, UserId: req.user._id }, req.body, { new: true, runValidators: true });
    if (!workout) return res.status(404).json({ success: false, message: 'Workout not found' });
    res.status(200).json({ success: true, data: workout });
  } catch (error) { next(error); }
};

const deleteWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findOneAndDelete({ _id: req.params.id, UserId: req.user._id });
    if (!workout) return res.status(404).json({ success: false, message: 'Workout not found' });
    res.status(200).json({ success: true, message: 'Workout deleted' });
  } catch (error) { next(error); }
};

const startWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findOneAndUpdate({ _id: req.params.id, UserId: req.user._id }, { $set: { StartedAt: new Date(), Status: 'In-Progress' } }, { new: true });
    if (!workout) return res.status(404).json({ success: false, message: 'Workout not found' });
    res.status(200).json({ success: true, data: workout });
  } catch (error) { next(error); }
};

const completeExercise = async (req, res, next) => {
  try {
    const { exerciseIndex } = req.body;
    const workout = await Workout.findOne({ _id: req.params.id, UserId: req.user._id });
    if (!workout) return res.status(404).json({ success: false, message: 'Workout not found' });
    if (exerciseIndex >= 0 && exerciseIndex < workout.Exercises.length) {
      workout.Exercises[exerciseIndex].Completed = true;
      await workout.save();
    }
    res.status(200).json({ success: true, data: workout });
  } catch (error) { next(error); }
};

const toggleFavorite = async (req, res, next) => {
  try {
    const workout = await Workout.findOneAndUpdate({ _id: req.params.id, UserId: req.user._id }, [{ $set: { IsFavorite: { $not: '$IsFavorite' } } }], { new: true });
    if (!workout) return res.status(404).json({ success: false, message: 'Workout not found' });
    res.status(200).json({ success: true, data: workout });
  } catch (error) { next(error); }
};

const cloneWorkout = async (req, res, next) => {
  try {
    const original = await Workout.findById(req.params.id);
    if (!original) return res.status(404).json({ success: false, message: 'Workout not found' });
    const cloned = await Workout.create({ ...original.toObject(), _id: undefined, UserId: req.user._id, Title: `Copy of ${original.Title}`, IsTemplate: false, IsPublic: false });
    res.status(201).json({ success: true, data: cloned });
  } catch (error) { next(error); }
};

const searchWorkouts = async (req, res, next) => {
  try {
    const { query: q, type, difficulty } = req.query;
    const filter = { UserId: req.user._id };
    if (q) filter.$or = [{ Title: { $regex: q, $options: 'i' } }, { Tags: { $regex: q, $options: 'i' } }];
    if (type) filter.Type = type;
    if (difficulty) filter.Difficulty = difficulty;
    const data = await Workout.find(filter).sort({ createdAt: -1 }).limit(50).lean();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) { next(error); }
};

module.exports = { createWorkout, getWorkouts, getWorkout, updateWorkout, deleteWorkout, startWorkout, completeExercise, toggleFavorite, cloneWorkout, searchWorkouts };
