const Nutrition = require('../Models/Nutrition_Model');
const Food = require('../Models/Food_Model');

const create_Nutrition = async (req, res, next) => {
  try {
    const entry = await Nutrition.create({ ...req.body, UserId: req.user._id });
    res.status(201).json({ success: true, data: entry });
  } catch (error) { next(error); }
};

const get_Nutritions = async (req, res, next) => {
  try {
    const { date, mealType, startDate, endDate, page = 1, limit = 20 } = req.query;
    const filter = { UserId: req.user._id };
    if (mealType) filter.MealType = mealType;
    if (date) filter.Date = { $gte: new Date(date), $lt: new Date(new Date(date).getTime() + 86400000) };
    if (startDate || endDate) {
      filter.Date = filter.Date || {};
      if (startDate) filter.Date.$gte = new Date(startDate);
      if (endDate) filter.Date.$lte = new Date(endDate);
    }
    const data = await Nutrition.find(filter).sort({ Date: -1 }).skip((page - 1) * limit).limit(Math.min(parseInt(limit), 50)).lean();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) { next(error); }
};

const updateNutrition = async (req, res, next) => {
  try {
    const entry = await Nutrition.findOneAndUpdate({ _id: req.params.id, UserId: req.user._id }, req.body, { new: true, runValidators: true });
    if (!entry) return res.status(404).json({ success: false, message: 'Entry not found' });
    res.status(200).json({ success: true, data: entry });
  } catch (error) { next(error); }
};

const deleteNutrition = async (req, res, next) => {
  try {
    await Nutrition.findOneAndDelete({ _id: req.params.id, UserId: req.user._id });
    res.status(200).json({ success: true, message: 'Entry deleted' });
  } catch (error) { next(error); }
};

const searchFoods = async (req, res, next) => {
  try {
    const { query: q, category } = req.query;
    const filter = {};
    if (q) filter.$text = { $search: q };
    if (category) filter.Category = category;
    const data = await Food.find(filter).limit(50).lean();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) { next(error); }
};

const createFood = async (req, res, next) => {
  try {
    const food = await Food.create({ ...req.body, AddedBy: req.user._id });
    res.status(201).json({ success: true, data: food });
  } catch (error) { next(error); }
};

module.exports = { create_Nutrition, get_Nutritions, updateNutrition, deleteNutrition, searchFoods, createFood };
