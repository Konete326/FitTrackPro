const mongoose = require('mongoose');

const Milestone_Schema = new mongoose.Schema({
  Title: { type: String, required: true },
  TargetValue: { type: Number, required: true },
  Achieved: { type: Boolean, default: false },
  AchievedAt: { type: Date },
}, { _id: true });

const Reminder_Schema = new mongoose.Schema({
  Time: { type: String, required: true },
  Days: [String],
  IsActive: { type: Boolean, default: true },
}, { _id: true });

const Goal_Schema = new mongoose.Schema({
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  Title: { type: String, required: [true, 'Goal title is required'] },
  Description: { type: String },
  Type: {
    type: String,
    required: true,
    enum: ['Weight-Loss', 'Muscle-Building', 'Endurance', 'Flexibility', 'Nutrition', 'Hydration', 'Sleep', 'Custom'],
  },
  TargetValue: { type: Number },
  CurrentValue: { type: Number, default: 0 },
  Unit: { type: String },
  Progress: { type: Number, default: 0, min: 0, max: 100 },
  Status: {
    type: String,
    enum: ['Active', 'Completed', 'Failed', 'Paused'],
    default: 'Active',
  },
  Frequency: { type: String, enum: ['Daily', 'Weekly', 'Monthly', 'Once'] },
  StartDate: { type: Date, default: Date.now },
  EndDate: { type: Date },
  Milestones: [Milestone_Schema],
  Reminders: [Reminder_Schema],
}, { timestamps: true });

Goal_Schema.index({ UserId: 1, Status: 1 });
Goal_Schema.index({ UserId: 1, Type: 1 });
Goal_Schema.index({ UserId: 1, EndDate: 1 });

Goal_Schema.pre('save', function (next) {
  if (this.TargetValue && this.TargetValue > 0) {
    this.Progress = Math.min(100, Math.round((this.CurrentValue / this.TargetValue) * 100));
  }
  next();
});

module.exports = mongoose.model('Goal', Goal_Schema);
