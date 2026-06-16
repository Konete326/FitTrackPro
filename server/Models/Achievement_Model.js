const mongoose = require('mongoose');

const Achievement_Schema = new mongoose.Schema({
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  Type: {
    type: String,
    required: true,
    enum: ['Workout', 'Nutrition', 'Progress', 'Consistency', 'Community', 'Challenge', 'Milestone'],
  },
  Title: { type: String, required: true },
  Description: { type: String },
  Icon: { type: String },
  Points: { type: Number, default: 0 },
  Criteria: { type: String },
  EarnedAt: { type: Date, default: Date.now },
  IsHidden: { type: Boolean, default: false },
}, { timestamps: true });

Achievement_Schema.index({ UserId: 1, Type: 1 });
Achievement_Schema.index({ UserId: 1, EarnedAt: -1 });

module.exports = mongoose.model('Achievement', Achievement_Schema);
