const Car = require('../models/Car');

const getCars = async (req, res) => {
  try {
    const cars = await Car.find();
    return res.status(200).json(cars);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    return res.status(200).json(car);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

const createCar = async (req, res) => {
  try {
    const car = await Car.create(req.body);
    return res.status(201).json(car);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

const updateCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    return res.status(200).json(car);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

const deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    return res.status(200).json({ message: 'Car deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getCars, getCarById, createCar, updateCar, deleteCar };