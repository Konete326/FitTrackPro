const MealPlan = require('../Models/MealPlan_Model');
const User = require('../Models/User_Model');
const Notification = require('../Models/Notification_Model');

const createMealPlanForClient = async (req, res, next) => {
  try {
    const client = await User.findById(req.params.id);
    if (!client || client.TrainerId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    const plan = await MealPlan.create({
      ...req.body,
      UserId: client._id,
      TrainerId: req.user._id,
      TrainerName: req.user.Profile?.Name || req.user.Username,
    });
    await Notification.create({
      UserId: client._id,
      Type: 'Nutrition',
      Title: 'New Meal Plan',
      Message: `Your trainer created a meal plan: "${plan.Title}".`,
      Link: '/nutrition',
    });
    res.status(201).json({ success: true, data: plan });
  } catch (error) { next(error); }
};

const getClientMealPlans = async (req, res, next) => {
  try {
    const client = await User.findById(req.params.id);
    if (!client || client.TrainerId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    const data = await MealPlan.find({ UserId: client._id, TrainerId: req.user._id })
      .sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) { next(error); }
};

const updateClientMealPlan = async (req, res, next) => {
  try {
    const plan = await MealPlan.findOneAndUpdate(
      { _id: req.params.planId, TrainerId: req.user._id, UserId: req.params.id },
      req.body, { new: true, runValidators: true }
    );
    if (!plan) return res.status(404).json({ success: false, message: 'Meal plan not found' });
    res.status(200).json({ success: true, data: plan });
  } catch (error) { next(error); }
};

const deleteClientMealPlan = async (req, res, next) => {
  try {
    await MealPlan.findOneAndDelete({ _id: req.params.planId, TrainerId: req.user._id, UserId: req.params.id });
    res.status(200).json({ success: true, message: 'Meal plan deleted' });
  } catch (error) { next(error); }
};

const toggleMealPlanActive = async (req, res, next) => {
  try {
    const plan = await MealPlan.findOneAndUpdate(
      { _id: req.params.planId, TrainerId: req.user._id },
      { IsActive: req.body.IsActive }, { new: true }
    );
    if (!plan) return res.status(404).json({ success: false, message: 'Meal plan not found' });
    res.status(200).json({ success: true, data: plan });
  } catch (error) { next(error); }
};

module.exports = { createMealPlanForClient, getClientMealPlans, updateClientMealPlan, deleteClientMealPlan, toggleMealPlanActive };
