const Car = require('../models/Car');
const asyncHandler = require('../middleware/asyncHandler');
const { STATUSES } = require('../constants');

const getCars = asyncHandler(async (req, res) => {
  const cars = await Car.find();
  return res.status(200).json(cars);
});

const getCarById = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (!car) {
    return res.status(404).json({ message: 'Car not found' });
  }
  return res.status(200).json(car);
});

const createCar = asyncHandler(async (req, res) => {
  const car = await Car.create(req.body);
  return res.status(201).json(car);
});

const updateCar = asyncHandler(async (req, res) => {
  const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: 'after',
    runValidators: true,
  });
  if (!car) {
    return res.status(404).json({ message: 'Car not found' });
  }
  return res.status(200).json(car);
});

const deleteCar = asyncHandler(async (req, res) => {
  const car = await Car.findByIdAndDelete(req.params.id);
  if (!car) {
    return res.status(404).json({ message: 'Car not found' });
  }
  return res.status(200).json({ message: 'Car deleted' });
});

const purchaseCar = asyncHandler(async (req, res) => {
  const car = await Car.findOneAndUpdate(
    { _id: req.params.id, quantity: { $gt: 0 } },
    { $inc: { quantity: -1 } },
    { returnDocument: 'after', runValidators: true }
  );

  if (!car) {
    const exists = await Car.findById(req.params.id);
    if (!exists) {
      return res.status(404).json({ message: 'Car not found' });
    }
    return res.status(400).json({ message: 'Vehicle is out of stock' });
  }

  if (car.quantity === 0 && car.status !== STATUSES.SOLD) {
    car.status = STATUSES.SOLD;
    await car.save();
  }

  return res.status(200).json(car);
});

const restockCar = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (!car) {
    return res.status(404).json({ message: 'Car not found' });
  }

  const rawAmount = req.body ? Number(req.body.amount) : NaN;
  const restockAmount = !isNaN(rawAmount) && rawAmount > 0 ? rawAmount : 1;
  car.quantity += restockAmount;
  if (car.quantity > 0 && car.status === STATUSES.SOLD) {
    car.status = STATUSES.AVAILABLE;
  }
  await car.save();

  return res.status(200).json(car);
});

const searchCars = asyncHandler(async (req, res) => {
  const { make, model, category, minPrice, maxPrice } = req.query;
  const query = {};

  if (make) {
    query.make = { $regex: make, $options: 'i' };
  }
  if (model) {
    query.model = { $regex: model, $options: 'i' };
  }
  if (category) {
    query.category = { $regex: category, $options: 'i' };
  }
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice && !isNaN(Number(minPrice))) {
      query.price.$gte = Number(minPrice);
    }
    if (maxPrice && !isNaN(Number(maxPrice))) {
      query.price.$lte = Number(maxPrice);
    }
  }

  const cars = await Car.find(query);
  return res.status(200).json(cars);
});

module.exports = {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  purchaseCar,
  restockCar,
  searchCars,
};