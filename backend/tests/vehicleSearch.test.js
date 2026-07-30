const request = require('supertest');
const app = require('../app');
const Car = require('../models/Car');

describe('GET /api/vehicles/search', () => {
  let userToken;

  beforeEach(async () => {
    const userEmail = `user-${Date.now()}@example.com`;

    await request(app).post('/api/auth/register').send({
      name: 'Search Tester',
      email: userEmail,
      password: 'Password123!',
    });

    const userLogin = await request(app).post('/api/auth/login').send({
      email: userEmail,
      password: 'Password123!',
    });

    userToken = userLogin.body.token;

    await Car.create([
      { make: 'Toyota', model: 'Camry', year: 2023, price: 25000, status: 'available', quantity: 3, category: 'Sedan', vin: `VIN-${Date.now()}-1` },
      { make: 'Toyota', model: 'RAV4', year: 2024, price: 32000, status: 'available', quantity: 2, category: 'SUV', vin: `VIN-${Date.now()}-2` },
      { make: 'Honda', model: 'Civic', year: 2022, price: 22000, status: 'available', quantity: 4, category: 'Sedan', vin: `VIN-${Date.now()}-3` },
      { make: 'Ford', model: 'F-150', year: 2023, price: 45000, status: 'available', quantity: 1, category: 'Truck', vin: `VIN-${Date.now()}-4` },
    ]);
  });

  it('returns 401 when search is attempted without token', async () => {
    const res = await request(app).get('/api/vehicles/search');
    expect(res.status).toBe(401);
  });

  it('filters vehicles by make (case-insensitive substring)', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?make=toy')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body.every((v) => v.make.toLowerCase().includes('toy'))).toBe(true);
  });

  it('filters vehicles by model (case-insensitive substring)', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?model=civic')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].model).toBe('Civic');
  });

  it('filters vehicles by category (case-insensitive substring)', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?category=suv')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].category).toBe('SUV');
  });

  it('filters vehicles by minPrice and maxPrice range', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?minPrice=23000&maxPrice=35000')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2); // Toyota Camry (25000) & Toyota RAV4 (32000)
    expect(res.body.every((v) => v.price >= 23000 && v.price <= 35000)).toBe(true);
  });

  it('combines multiple query parameters', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?make=Toyota&category=Sedan&maxPrice=30000')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].model).toBe('Camry');
  });
});
