const mongoose = require('mongoose');

const Water_Schema = new mongoose.Schema({
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  Date: { type: Date, default: Date.now },
  Time: { type: String },
  Amount: {
    Value: { type: Number, required: true },
    Unit: { type: String, enum: ['ml', 'l', 'cup', 'oz'], default: 'ml' },
  },
  Notes: { type: String },
}, { timestamps: true });

Water_Schema.index({ UserId: 1, Date: -1 });

module.exports = mongoose.model('Water', Water_Schema);
