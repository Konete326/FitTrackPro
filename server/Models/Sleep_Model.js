const mongoose = require('mongoose');

const Sleep_Schema = new mongoose.Schema({
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  Date: { type: Date, default: Date.now },
  SleepTime: { type: String, required: true },
  WakeTime: { type: String, required: true },
  Duration: { type: Number },
  Quality: { type: Number, min: 1, max: 10 },
  DeepSleep: { type: Number, default: 0 },
  LightSleep: { type: Number, default: 0 },
  RemSleep: { type: Number, default: 0 },
  AwakeCount: { type: Number, default: 0 },
  Notes: { type: String },
}, { timestamps: true });

Sleep_Schema.index({ UserId: 1, Date: -1 });
Sleep_Schema.index({ UserId: 1, Quality: 1 });

Sleep_Schema.pre('save', function (next) {
  if (this.SleepTime && this.WakeTime) {
    const [sleepH, sleepM] = this.SleepTime.split(':').map(Number);
    const [wakeH, wakeM] = this.WakeTime.split(':').map(Number);
    let sleepMinutes = sleepH * 60 + sleepM;
    let wakeMinutes = wakeH * 60 + wakeM;
    if (wakeMinutes <= sleepMinutes) wakeMinutes += 24 * 60;
    this.Duration = wakeMinutes - sleepMinutes;
  }
  next();
});

module.exports = mongoose.model('Sleep', Sleep_Schema);
