const express = require('express');
const {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
} = require('../controllers/carController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getCars);
router.get('/:id', getCarById);
router.post('/', protect, authorize('admin'), createCar);
router.put('/:id', protect, authorize('admin'), updateCar);
router.delete('/:id', protect, authorize('admin'), deleteCar);

module.exports = router;