const mongoose = require('mongoose');

const Reply_Schema = new mongoose.Schema({
  Message: { type: String, required: true },
  AdminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Feedback_Schema = new mongoose.Schema({
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  Name: { type: String, required: true },
  Email: { type: String, required: true },
  Message: { type: String, required: true },
  IsRead: { type: Boolean, default: false },
  AdminResponse: { type: String },
  Replies: [Reply_Schema],
}, { timestamps: true });

module.exports = mongoose.model('Feedback', Feedback_Schema);
