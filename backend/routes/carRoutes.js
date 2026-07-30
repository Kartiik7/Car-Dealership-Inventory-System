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
const { ROLES } = require('../constants');

const router = express.Router();

router.get('/search', protect, searchCars);
router.get('/', protect, getCars);
router.get('/:id', protect, getCarById);
router.post('/', protect, authorize(ROLES.ADMIN), createCar);
router.put('/:id', protect, authorize(ROLES.ADMIN), updateCar);
router.delete('/:id', protect, authorize(ROLES.ADMIN), deleteCar);

router.post('/:id/purchase', protect, purchaseCar);
router.post('/:id/restock', protect, authorize(ROLES.ADMIN), restockCar);

module.exports = router;