const express = require('express');
const {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  purchaseCar,
  restockCar,
  searchCars,
} = require('../controllers/carController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/search', protect, searchCars);
router.get('/', getCars);
router.get('/:id', getCarById);
router.post('/', protect, authorize('admin'), createCar);
router.put('/:id', protect, authorize('admin'), updateCar);
router.delete('/:id', protect, authorize('admin'), deleteCar);

router.post('/:id/purchase', protect, purchaseCar);
router.post('/:id/restock', protect, authorize('admin'), restockCar);

module.exports = router;