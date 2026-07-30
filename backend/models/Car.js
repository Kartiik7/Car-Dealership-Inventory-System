const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  make: { type: String, required: true, trim: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['available', 'reserved', 'sold'], default: 'available' },
  quantity: { type: Number, default: 1, min: 0 },
  category: { type: String, enum: ['Sedan', 'SUV', 'Truck', 'Coupe', 'Hatchback'], default: 'Sedan' },
  vin: { type: String, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.models.Car || mongoose.model('Car', carSchema);