const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['available', 'reserved', 'sold'], default: 'available' },
  quantity: { type: Number, default: 1, min: 0 },
  category: { type: String, default: 'Sedan' },
  vin: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Car || mongoose.model('Car', carSchema);