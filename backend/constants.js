const ROLES = Object.freeze({
  ADMIN: 'admin',
  USER: 'user',
});

const STATUSES = Object.freeze({
  AVAILABLE: 'available',
  RESERVED: 'reserved',
  SOLD: 'sold',
});

const CATEGORIES = Object.freeze([
  'Sedan',
  'SUV',
  'Truck',
  'Coupe',
  'Hatchback',
]);

module.exports = {
  ROLES,
  STATUSES,
  CATEGORIES,
};
