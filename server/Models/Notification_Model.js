const mongoose = require('mongoose');

const Notification_Schema = new mongoose.Schema({
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  Type: {
    type: String,
    required: true,
    enum: ['Workout', 'Goal', 'Streak', 'System', 'Message', 'Feedback', 'Password-Reset', 'Achievement'],
  },
  Title: { type: String, required: true },
  Message: { type: String, required: true },
  IsRead: { type: Boolean, default: false },
  Priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  Data: { type: mongoose.Schema.Types.Mixed },
  Link: { type: String },
  ExpiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    index: { expireAfterSeconds: 0 },
  },
}, { timestamps: true });

Notification_Schema.index({ UserId: 1, IsRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', Notification_Schema);
