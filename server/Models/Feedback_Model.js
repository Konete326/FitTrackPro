const mongoose = require('mongoose');

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
}, { timestamps: true });

module.exports = mongoose.model('Feedback', Feedback_Schema);
