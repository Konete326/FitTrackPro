const Progress = require('../Models/Progress_Model');

const createProgress = async (req, res, next) => {
  try {
    const entry = await Progress.create({ ...req.body, UserId: req.user._id });
    res.status(201).json({ success: true, data: entry });
  } catch (error) { next(error); }
};

const getProgress = async (req, res, next) => {
  try {
    const { startDate, endDate, isMilestone, page = 1, limit = 20 } = req.query;
    const filter = { UserId: req.user._id };
    if (isMilestone) filter.IsMilestone = true;
    if (startDate || endDate) {
      filter.Date = {};
      if (startDate) filter.Date.$gte = new Date(startDate);
      if (endDate) filter.Date.$lte = new Date(endDate);
    }
    const data = await Progress.find(filter).sort({ Date: -1 }).skip((page - 1) * limit).limit(Math.min(parseInt(limit), 50)).lean();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) { next(error); }
};

const updateProgress = async (req, res, next) => {
  try {
    const entry = await Progress.findOneAndUpdate({ _id: req.params.id, UserId: req.user._id }, req.body, { new: true });
    if (!entry) return res.status(404).json({ success: false, message: 'Entry not found' });
    res.status(200).json({ success: true, data: entry });
  } catch (error) { next(error); }
};

const deleteProgress = async (req, res, next) => {
  try {
    await Progress.findOneAndDelete({ _id: req.params.id, UserId: req.user._id });
    res.status(200).json({ success: true, message: 'Entry deleted' });
  } catch (error) { next(error); }
};

module.exports = { createProgress, getProgress, updateProgress, deleteProgress };
