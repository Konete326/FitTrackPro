const Achievement = require('../Models/Achievement_Model');

const getAchievements = async (req, res, next) => {
  try {
    const { type, page = 1, limit = 20 } = req.query;
    const filter = { UserId: req.user._id };
    if (type) filter.Type = type;
    const data = await Achievement.find(filter).sort({ EarnedAt: -1 }).skip((page - 1) * limit).limit(Math.min(parseInt(limit), 50)).lean();
    const totalPoints = await Achievement.aggregate([{ $match: { UserId: req.user._id } }, { $group: { _id: null, total: { $sum: '$Points' } } }]);
    res.status(200).json({ success: true, count: data.length, totalPoints: totalPoints[0]?.total || 0, data });
  } catch (error) { next(error); }
};

const getLeaderboard = async (req, res, next) => {
  try {
    const leaderboard = await Achievement.aggregate([
      { $group: { _id: '$UserId', totalPoints: { $sum: '$Points' } } },
      { $sort: { totalPoints: -1 } },
      { $limit: 20 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { totalPoints: 1, 'user.Username': 1, 'user.Profile.Name': 1, 'user.Profile.ProfilePicture': 1 } },
    ]);
    res.status(200).json({ success: true, data: leaderboard });
  } catch (error) { next(error); }
};

module.exports = { getAchievements, getLeaderboard };
