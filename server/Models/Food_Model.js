const mongoose = require('mongoose');

const Food_Schema = new mongoose.Schema({
  Name: { type: String, required: true },
  Brand: { type: String },
  Barcode: { type: String, unique: true, sparse: true },
  ServingSize: { type: String },
  Calories: { type: Number, default: 0 },
  Protein: { type: Number, default: 0 },
  Carbs: { type: Number, default: 0 },
  Fat: { type: Number, default: 0 },
  Fiber: { type: Number, default: 0 },
  Sugar: { type: Number, default: 0 },
  Sodium: { type: Number, default: 0 },
  Category: { type: String },
  IsVerified: { type: Boolean, default: false },
  AddedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

Food_Schema.index({ Name: 'text', Brand: 'text' });
Food_Schema.index({ Category: 1 });
Food_Schema.index({ IsVerified: 1 });

module.exports = mongoose.model('Food', Food_Schema);
