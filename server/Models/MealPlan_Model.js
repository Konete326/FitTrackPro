const mongoose = require('mongoose');

const MealPlanFoodItem_Schema = new mongoose.Schema({
  Name: { type: String, required: true },
  Quantity: { type: String, required: true },
  Calories: { type: Number, default: 0 },
  Protein: { type: Number, default: 0 },
  Carbs: { type: Number, default: 0 },
  Fat: { type: Number, default: 0 },
}, { _id: false });

const MealPlanMeal_Schema = new mongoose.Schema({
  MealType: {
    type: String,
    required: true,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Pre-Workout', 'Post-Workout'],
  },
  Time: { type: String },
  FoodItems: [MealPlanFoodItem_Schema],
  Instructions: { type: String },
  TotalCalories: { type: Number, default: 0 },
  TotalProtein: { type: Number, default: 0 },
  TotalCarbs: { type: Number, default: 0 },
  TotalFat: { type: Number, default: 0 },
}, { _id: true });

const MealPlanDay_Schema = new mongoose.Schema({
  DayOfWeek: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
  Meals: [MealPlanMeal_Schema],
  DailyCalories: { type: Number, default: 0 },
  DailyProtein: { type: Number, default: 0 },
  DailyCarbs: { type: Number, default: 0 },
  DailyFat: { type: Number, default: 0 },
  Notes: { type: String },
}, { _id: true });

const MealPlan_Schema = new mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String },
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  TrainerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  TrainerName: { type: String },
  DurationDays: { type: Number, default: 7 },
  Days: [MealPlanDay_Schema],
  StartDate: { type: Date },
  EndDate: { type: Date },
  IsActive: { type: Boolean, default: true },
  TargetCalories: { type: Number },
  TargetProtein: { type: Number },
  TargetCarbs: { type: Number },
  TargetFat: { type: Number },
  DietaryPreference: { type: String },
}, { timestamps: true });

MealPlan_Schema.index({ UserId: 1, IsActive: 1 });
MealPlan_Schema.index({ TrainerId: 1 });

MealPlan_Schema.pre('save', function (next) {
  this.Days.forEach((day) => {
    day.DailyCalories = day.Meals.reduce((sum, m) => sum + (m.TotalCalories || 0), 0);
    day.DailyProtein = day.Meals.reduce((sum, m) => sum + (m.TotalProtein || 0), 0);
    day.DailyCarbs = day.Meals.reduce((sum, m) => sum + (m.TotalCarbs || 0), 0);
    day.DailyFat = day.Meals.reduce((sum, m) => sum + (m.TotalFat || 0), 0);
    day.Meals.forEach((meal) => {
      meal.TotalCalories = meal.FoodItems.reduce((sum, f) => sum + (f.Calories || 0), 0);
      meal.TotalProtein = meal.FoodItems.reduce((sum, f) => sum + (f.Protein || 0), 0);
      meal.TotalCarbs = meal.FoodItems.reduce((sum, f) => sum + (f.Carbs || 0), 0);
      meal.TotalFat = meal.FoodItems.reduce((sum, f) => sum + (f.Fat || 0), 0);
    });
  });
  next();
});

module.exports = mongoose.model('MealPlan', MealPlan_Schema);
