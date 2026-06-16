const Water = require('../Models/Water_Model');

const log_Water = async (req, res, next) => {
  try {
    const entry = await Water.create({ ...req.body, UserId: req.user._id });
    res.status(201).json({ success: true, data: entry });
  } catch (error) { next(error); }
};

const get_waterIntake = async (req, res, next) => {
  try {
    const { date, page = 1, limit = 50 } = req.query;
    const filter = { UserId: req.user._id };
    if (date) filter.Date = { $gte: new Date(date), $lt: new Date(new Date(date).getTime() + 86400000) };
    const data = await Water.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Math.min(parseInt(limit), 50)).lean();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) { next(error); }
};

const update_Water = async (req, res, next) => {
  try {
    const entry = await Water.findOneAndUpdate({ _id: req.params.id, UserId: req.user._id }, req.body, { new: true });
    if (!entry) return res.status(404).json({ success: false, message: 'Entry not found' });
    res.status(200).json({ success: true, data: entry });
  } catch (error) { next(error); }
};

const delete_Water = async (req, res, next) => {
  try {
    await Water.findOneAndDelete({ _id: req.params.id, UserId: req.user._id });
    res.status(200).json({ success: true, message: 'Entry deleted' });
  } catch (error) { next(error); }
};

module.exports = { log_Water, get_waterIntake, update_Water, delete_Water };
