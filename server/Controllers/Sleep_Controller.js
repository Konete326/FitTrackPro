const Sleep = require('../Models/Sleep_Model');

const logSleep = async (req, res, next) => {
  try {
    const entry = await Sleep.create({ ...req.body, UserId: req.user._id });
    res.status(201).json({ success: true, data: entry });
  } catch (error) { next(error); }
};

const getSleepLogs = async (req, res, next) => {
  try {
    const { startDate, endDate, page = 1, limit = 20 } = req.query;
    const filter = { UserId: req.user._id };
    if (startDate || endDate) {
      filter.Date = {};
      if (startDate) filter.Date.$gte = new Date(startDate);
      if (endDate) filter.Date.$lte = new Date(endDate);
    }
    const data = await Sleep.find(filter).sort({ Date: -1 }).skip((page - 1) * limit).limit(Math.min(parseInt(limit), 50)).lean();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) { next(error); }
};

const updateSleep = async (req, res, next) => {
  try {
    const entry = await Sleep.findOneAndUpdate({ _id: req.params.id, UserId: req.user._id }, req.body, { new: true });
    if (!entry) return res.status(404).json({ success: false, message: 'Entry not found' });
    res.status(200).json({ success: true, data: entry });
  } catch (error) { next(error); }
};

const deleteSleep = async (req, res, next) => {
  try {
    await Sleep.findOneAndDelete({ _id: req.params.id, UserId: req.user._id });
    res.status(200).json({ success: true, message: 'Entry deleted' });
  } catch (error) { next(error); }
};

module.exports = { logSleep, getSleepLogs, updateSleep, deleteSleep };
