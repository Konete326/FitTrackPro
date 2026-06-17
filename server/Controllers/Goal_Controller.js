const Goal = require('../Models/Goal_Model');
const Notification = require('../Models/Notification_Model');

const create_Goal = async (req, res, next) => {
  try {
    const goal = await Goal.create({ ...req.body, UserId: req.user._id });
    await Notification.create({ UserId: req.user._id, Type: 'Goal', Title: 'Goal Created', Message: `"${goal.Title}" goal has been set.`, Link: '/goals' });
    res.status(201).json({ success: true, data: goal });
  } catch (error) { next(error); }
};

const get_Goals = async (req, res, next) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    const filter = { UserId: req.user._id };
    if (status) filter.Status = status;
    if (type) filter.Type = type;
    const data = await Goal.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Math.min(parseInt(limit), 50)).lean();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) { next(error); }
};

const update_Goal = async (req, res, next) => {
  try {
    const goal = await Goal.findOneAndUpdate({ _id: req.params.id, UserId: req.user._id }, req.body, { new: true });
    if (!goal) return res.status(404).json({ success: false, message: 'Goal not found' });
    res.status(200).json({ success: true, data: goal });
  } catch (error) { next(error); }
};

const delete_Goal = async (req, res, next) => {
  try {
    await Goal.findOneAndDelete({ _id: req.params.id, UserId: req.user._id });
    res.status(200).json({ success: true, message: 'Goal deleted' });
  } catch (error) { next(error); }
};

const update_GoalProgress = async (req, res, next) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, UserId: req.user._id });
    if (!goal) return res.status(404).json({ success: false, message: 'Goal not found' });
    goal.CurrentValue = req.body.currentValue;
    await goal.save();
    if (goal.Progress >= 100) {
      goal.Status = 'Completed';
      await goal.save();
      await Notification.create({ UserId: req.user._id, Type: 'Goal', Title: 'Goal Completed!', Message: `Congratulations! "${goal.Title}" has been completed.`, Link: '/goals' });
    }
    res.status(200).json({ success: true, data: goal });
  } catch (error) { next(error); }
};

module.exports = { create_Goal, get_Goals, update_Goal, delete_Goal, update_GoalProgress };
