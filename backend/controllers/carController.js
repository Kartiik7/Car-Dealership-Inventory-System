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
    console.error('Error creating car:', error.message);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A car with this VIN already exists' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message || 'Server error' });
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
    console.error('Error updating car:', error.message);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A car with this VIN already exists' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message || 'Server error' });
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
    console.error('Error deleting car:', error.message);
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

const purchaseCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    if (car.quantity <= 0) {
      return res.status(400).json({ message: 'Vehicle is out of stock' });
    }

    car.quantity -= 1;
    if (car.quantity === 0) {
      car.status = 'sold';
    }
    await car.save();

    return res.status(200).json(car);
  } catch (error) {
    console.error('Error purchasing car:', error.message);
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

const restockCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const rawAmount = req.body ? Number(req.body.amount) : NaN;
    const restockAmount = !isNaN(rawAmount) && rawAmount > 0 ? rawAmount : 1;
    car.quantity += restockAmount;
    if (car.quantity > 0 && car.status === 'sold') {
      car.status = 'available';
    }
    await car.save();

    return res.status(200).json(car);
  } catch (error) {
    console.error('Error restocking car:', error.message);
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

const searchCars = async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Error searching cars:', error.message);
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

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