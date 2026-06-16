const mongoose = require('mongoose');

const BodyMeasurement_Schema = new mongoose.Schema({
  Chest: { type: Number },
  Waist: { type: Number },
  Hips: { type: Number },
  Arms: { type: Number },
  Thighs: { type: Number },
  Calves: { type: Number },
  Neck: { type: Number },
  Unit: { type: String, enum: ['cm', 'in'], default: 'cm' },
}, { _id: false });

const PerformanceMetric_Schema = new mongoose.Schema({
  Name: { type: String, required: true },
  Value: { type: Number, required: true },
  Unit: { type: String },
}, { _id: false });

const Progress_Schema = new mongoose.Schema({
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  Date: { type: Date, default: Date.now },
  Weight: { type: Number },
  BodyFatPercentage: { type: Number, min: 0, max: 100 },
  MuscleMass: { type: Number },
  BodyMeasurements: BodyMeasurement_Schema,
  PerformanceMetrics: [PerformanceMetric_Schema],
  EnergyLevel: { type: Number, min: 1, max: 10 },
  SleepQuality: { type: Number, min: 1, max: 10 },
  StressLevel: { type: Number, min: 1, max: 10 },
  Notes: { type: String },
  Photos: [String],
  IsMilestone: { type: Boolean, default: false },
}, { timestamps: true });

Progress_Schema.index({ UserId: 1, Date: -1 });
Progress_Schema.index({ UserId: 1, IsMilestone: 1 });

module.exports = mongoose.model('Progress', Progress_Schema);
