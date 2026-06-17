const MealPlan = require('../Models/MealPlan_Model');

const getMyMealPlans = async (req, res, next) => {
  try {
    const data = await MealPlan.find({ UserId: req.user._id, IsActive: true })
      .sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) { next(error); }
};

const getMyMealPlanById = async (req, res, next) => {
  try {
    const plan = await MealPlan.findOne({ _id: req.params.id, UserId: req.user._id }).lean();
    if (!plan) return res.status(404).json({ success: false, message: 'Meal plan not found' });
    res.status(200).json({ success: true, data: plan });
  } catch (error) { next(error); }
};

module.exports = { getMyMealPlans, getMyMealPlanById };
