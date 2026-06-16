const mongoose = require('mongoose');

const FoodItem_Schema = new mongoose.Schema({
  Name: { type: String, required: true },
  Quantity: { type: Number, required: true },
  Calories: { type: Number, default: 0 },
  Protein: { type: Number, default: 0 },
  Carbs: { type: Number, default: 0 },
  Fat: { type: Number, default: 0 },
  Fiber: { type: Number, default: 0 },
  Sugar: { type: Number, default: 0 },
  Sodium: { type: Number, default: 0 },
}, { _id: false });

const Nutrition_Schema = new mongoose.Schema({
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  MealType: {
    type: String,
    required: true,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Pre-Workout', 'Post-Workout'],
  },
  Date: { type: Date, default: Date.now },
  Time: { type: String },
  FoodItems: [FoodItem_Schema],
  TotalCalories: { type: Number, default: 0 },
  TotalProtein: { type: Number, default: 0 },
  TotalCarbs: { type: Number, default: 0 },
  TotalFat: { type: Number, default: 0 },
  WaterIntake: { type: Number, default: 0 },
  Notes: { type: String },
  Location: { type: String },
  Mood: { type: String },
}, { timestamps: true });

Nutrition_Schema.index({ UserId: 1, Date: -1 });
Nutrition_Schema.index({ UserId: 1, MealType: 1 });

Nutrition_Schema.pre('save', function (next) {
  if (this.FoodItems && this.FoodItems.length > 0) {
    this.TotalCalories = this.FoodItems.reduce((sum, item) => sum + (item.Calories || 0), 0);
    this.TotalProtein = this.FoodItems.reduce((sum, item) => sum + (item.Protein || 0), 0);
    this.TotalCarbs = this.FoodItems.reduce((sum, item) => sum + (item.Carbs || 0), 0);
    this.TotalFat = this.FoodItems.reduce((sum, item) => sum + (item.Fat || 0), 0);
  }
  next();
});

module.exports = mongoose.model('Nutrition', Nutrition_Schema);
