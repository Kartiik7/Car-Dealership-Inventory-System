const mongoose = require('mongoose');
const { STATUSES, CATEGORIES } = require('../constants');

const carSchema = new mongoose.Schema({
  make: { type: String, required: true, trim: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: Object.values(STATUSES), default: STATUSES.AVAILABLE },
  quantity: { type: Number, default: 1, min: 0 },
  category: { type: String, enum: CATEGORIES, default: CATEGORIES[0] },
  vin: { type: String, required: true, unique: true },
}, { timestamps: true });

carSchema.index({ make: 1 });
carSchema.index({ category: 1 });
carSchema.index({ price: 1 });

module.exports = mongoose.models.Car || mongoose.model('Car', carSchema);