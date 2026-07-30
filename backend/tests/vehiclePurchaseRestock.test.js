const request = require('supertest');
const app = require('../app');
const Car = require('../models/Car');

describe('Vehicle Purchase and Restock API', () => {
  let userToken;
  let adminToken;
  let sampleCar;

  beforeEach(async () => {
    const userEmail = `user-${Date.now()}@example.com`;
    const adminEmail = `admin-${Date.now()}@example.com`;

    await request(app).post('/api/auth/register').send({
      name: 'Normal User',
      email: userEmail,
      password: 'Password123!',
    });

    const userLogin = await request(app).post('/api/auth/login').send({
      email: userEmail,
      password: 'Password123!',
    });

    await request(app).post('/api/auth/register').send({
      name: 'Admin User',
      email: adminEmail,
      password: 'Password123!',
      role: 'admin',
    });

    const adminLogin = await request(app).post('/api/auth/login').send({
      email: adminEmail,
      password: 'Password123!',
    });

    userToken = userLogin.body.token;
    adminToken = adminLogin.body.token;

    sampleCar = await Car.create({
      make: 'Tesla',
      model: 'Model 3',
      year: 2024,
      price: 45000,
      status: 'available',
      quantity: 2,
      category: 'Sedan',
      vin: `VIN-${Date.now()}`,
    });
  });

  describe('POST /api/vehicles/:id/purchase', () => {
    it('returns 401 when purchase is attempted without token', async () => {
      const res = await request(app).post(`/api/vehicles/${sampleCar._id}/purchase`);
      expect(res.status).toBe(401);
    });

    it('returns 404 when purchasing a non-existent vehicle', async () => {
      const fakeId = '000000000000000000000000';
      const res = await request(app)
        .post(`/api/vehicles/${fakeId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(404);
    });

    it('decreases vehicle quantity by 1 for authenticated user', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${sampleCar._id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.quantity).toBe(1);
    });

    it('returns 400 when attempting to purchase an out of stock vehicle (quantity === 0)', async () => {
      sampleCar.quantity = 0;
      await sampleCar.save();

      const res = await request(app)
        .post(`/api/vehicles/${sampleCar._id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/out of stock/i);
    });
  });

  describe('POST /api/vehicles/:id/restock', () => {
    it('returns 401 when restock is attempted without token', async () => {
      const res = await request(app).post(`/api/vehicles/${sampleCar._id}/restock`);
      expect(res.status).toBe(401);
    });

    it('returns 403 when a non-admin user attempts restock', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${sampleCar._id}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ amount: 5 });

      expect(res.status).toBe(403);
    });

    it('increases vehicle quantity by specified amount for admin user', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${sampleCar._id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ amount: 5 });

      expect(res.status).toBe(200);
      expect(res.body.quantity).toBe(7);
    });

    it('increases vehicle quantity by default 1 if amount is not specified for admin', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${sampleCar._id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.quantity).toBe(3);
    });
  });
});
