const mongoose = require('mongoose');

const TrainerRequest_Schema = new mongoose.Schema({
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
  Message: { type: String },
  Status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  AdminNotes: { type: String },
}, { timestamps: true });

TrainerRequest_Schema.index({ UserId: 1, TrainerId: 1, Status: 1 }, {
  unique: true,
  partialFilterExpression: { Status: 'Pending' },
});

module.exports = mongoose.model('TrainerRequest', TrainerRequest_Schema);
