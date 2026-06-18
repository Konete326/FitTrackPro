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

const get_dailySummary = async (req, res, next) => {
  try {
    const { date } = req.params;
    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(startOfDay.getTime() + 86400000);
    const result = await Water.aggregate([
      { $match: { UserId: req.user._id, Date: { $gte: startOfDay, $lt: endOfDay } } },
      { $group: { _id: null, totalAmount: { $sum: '$Amount.Value' } } },
    ]);
    res.status(200).json({ success: true, data: { totalAmount: result[0]?.totalAmount || 0 } });
  } catch (error) { next(error); }
};

const get_hydrationStats = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);
    const result = await Water.aggregate([
      { $match: { UserId: req.user._id, Date: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$Date' } },
          dailyTotal: { $sum: '$Amount.Value' },
        },
      },
    ]);
    const days = result.length;
    const totalIntake = result.reduce((sum, d) => sum + d.dailyTotal, 0);
    const avgDaily = days > 0 ? totalIntake / 30 : 0;
    const bestDay = result.reduce((best, d) => (d.dailyTotal > (best?.dailyTotal || 0) ? d : best), null);
    res.status(200).json({
      success: true,
      data: {
        summary: {
          avgDaily: Math.round(avgDaily),
          totalDays: days,
          totalIntake,
          bestDay: bestDay ? { date: bestDay._id, amount: bestDay.dailyTotal } : null,
        },
      },
    });
  } catch (error) { next(error); }
};

const get_hydrationStreak = async (req, res, next) => {
  try {
    const GOAL = 2000;
    const results = await Water.aggregate([
      { $match: { UserId: req.user._id } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$Date' } },
          dailyTotal: { $sum: '$Amount.Value' },
        },
      },
      { $sort: { _id: -1 } },
    ]);
    let streak = 0;
    const today = format(new Date(), 'yyyy-MM-dd');
    const dateMap = {};
    results.forEach((r) => { dateMap[r._id] = r.dailyTotal; });
    for (let i = 0; i < 365; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = format(d, 'yyyy-MM-dd');
      if (dateMap[key] && dateMap[key] >= GOAL) {
        streak++;
      } else if (i === 0) {
        continue;
      } else {
        break;
      }
    }
    res.status(200).json({ success: true, data: { streak } });
  } catch (error) { next(error); }
};

function format(date, fmt) {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return fmt.replace('yyyy', yyyy).replace('MM', mm).replace('dd', dd);
}

module.exports = { log_Water, get_waterIntake, update_Water, delete_Water, get_dailySummary, get_hydrationStats, get_hydrationStreak };
