require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Car = require('./models/Car');

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/car_inventory_db';

const usersData = [
  // 5 Standard Users
  { name: 'Alice Smith', email: 'user1@example.com', password: 'Password123!', role: 'user' },
  { name: 'Bob Jones', email: 'user2@example.com', password: 'Password123!', role: 'user' },
  { name: 'Charlie Brown', email: 'user3@example.com', password: 'Password123!', role: 'user' },
  { name: 'Diana Prince', email: 'user4@example.com', password: 'Password123!', role: 'user' },
  { name: 'Ethan Hunt', email: 'user5@example.com', password: 'Password123!', role: 'user' },

  // Demo Accounts (From README)
  { name: 'Demo Admin', email: 'admin@dealership.com', password: 'Password123!', role: 'admin' },
  { name: 'Demo User', email: 'user@dealership.com', password: 'Password123!', role: 'user' },

  // 3 Admin Users
  { name: 'Admin One', email: 'admin1@example.com', password: 'AdminPassword123!', role: 'admin' },
  { name: 'Admin Two', email: 'admin2@example.com', password: 'AdminPassword123!', role: 'admin' },
  { name: 'Admin Three', email: 'admin3@example.com', password: 'AdminPassword123!', role: 'admin' },
];

const carsData = [
  // Sedans
  { make: 'Toyota', model: 'Camry', year: 2024, price: 26400, status: 'available', quantity: 5, category: 'Sedan', vin: '1HGCR2F83HA000001' },
  { make: 'Honda', model: 'Accord', year: 2023, price: 27800, status: 'available', quantity: 3, category: 'Sedan', vin: '1HGCR2F83HA000002' },
  { make: 'Hyundai', model: 'Elantra', year: 2023, price: 21000, status: 'available', quantity: 4, category: 'Sedan', vin: '1HGCR2F83HA000003' },
  { make: 'BMW', model: '3 Series', year: 2024, price: 44500, status: 'available', quantity: 2, category: 'Sedan', vin: '1HGCR2F83HA000004' },
  
  // SUVs
  { make: 'Toyota', model: 'RAV4', year: 2024, price: 28650, status: 'available', quantity: 6, category: 'SUV', vin: '1HGCR2F83HA000005' },
  { make: 'Ford', model: 'Explorer', year: 2023, price: 36760, status: 'available', quantity: 3, category: 'SUV', vin: '1HGCR2F83HA000006' },
  { make: 'Jeep', model: 'Grand Cherokee', year: 2024, price: 40130, status: 'available', quantity: 4, category: 'SUV', vin: '1HGCR2F83HA000007' },
  { make: 'Tesla', model: 'Model Y', year: 2024, price: 44990, status: 'available', quantity: 5, category: 'SUV', vin: '1HGCR2F83HA000008' },
  
  // Trucks
  { make: 'Ford', model: 'F-150', year: 2024, price: 36570, status: 'available', quantity: 4, category: 'Truck', vin: '1HGCR2F83HA000009' },
  { make: 'Chevrolet', model: 'Silverado 1500', year: 2023, price: 36800, status: 'available', quantity: 2, category: 'Truck', vin: '1HGCR2F83HA000010' },
  { make: 'RAM', model: '1500', year: 2024, price: 39420, status: 'available', quantity: 3, category: 'Truck', vin: '1HGCR2F83HA000011' },

  // Coupes
  { make: 'Ford', model: 'Mustang GT', year: 2024, price: 42495, status: 'available', quantity: 2, category: 'Coupe', vin: '1HGCR2F83HA000012' },
  { make: 'Chevrolet', model: 'Camaro SS', year: 2023, price: 37795, status: 'available', quantity: 1, category: 'Coupe', vin: '1HGCR2F83HA000013' },

  // Hatchbacks
  { make: 'Volkswagen', model: 'Golf GTI', year: 2024, price: 31965, status: 'available', quantity: 3, category: 'Hatchback', vin: '1HGCR2F83HA000014' },
  { make: 'Mazda', model: 'Mazda3 Hatchback', year: 2023, price: 25600, status: 'available', quantity: 4, category: 'Hatchback', vin: '1HGCR2F83HA000015' },
];

async function seedDatabase() {
  try {
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing users and cars...');
    await User.deleteMany({});
    await Car.deleteMany({});

    console.log('Seeding 5 Standard Users & 3 Admin Users...');
    for (const userData of usersData) {
      await User.create(userData);
    }
    console.log('✓ Users created successfully');

    console.log('Seeding 15 Vehicles across different categories...');
    await Car.insertMany(carsData);
    console.log('✓ 15 Vehicles created successfully');

    console.log('\n--- SEED SUMMARY ---');
    console.log('Users created:');
    console.log('  Demo Users (password: Password123!):');
    console.log('    - admin@dealership.com (Admin)');
    console.log('    - user@dealership.com (User)');
    console.log('  Standard Users (password: Password123!):');
    console.log('    - user1@example.com\n    - user2@example.com\n    - user3@example.com\n    - user4@example.com\n    - user5@example.com');
    console.log('  Admin Users (password: AdminPassword123!):');
    console.log('    - admin1@example.com\n    - admin2@example.com\n    - admin3@example.com');
    console.log('Vehicles created: 15 (Sedan, SUV, Truck, Coupe, Hatchback)');
    console.log('--------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();
