const request = require('supertest');
const app = require('../app');

describe('Car Inventory API', () => {
  let userToken;
  let adminToken;

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

    await require('../models/User').create({
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
  });

  it('GET /api/cars returns 200 and a list of cars', async () => {
    const res = await request(app).get('/api/cars').set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/cars/:id returns 200 and the car if found', async () => {
    const createRes = await request(app)
      .post('/api/cars')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        make: 'Toyota',
        model: 'Camry',
        year: 2024,
        price: 30000,
        status: 'available',
        vin: '1HGCM82633A123456',
      });
    const carId = createRes.body._id;
    const res = await request(app).get(`/api/cars/${carId}`).set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id', carId);
  });

  it('POST /api/cars returns 403 for a normal user', async () => {
    const res = await request(app)
      .post('/api/cars')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        make: 'Toyota',
        model: 'Camry',
        year: 2024,
        price: 30000,
        status: 'available',
        vin: '1HGCM82633A123456',
      });

    expect(res.status).toBe(403);
  });

  it('POST /api/cars returns 201 and the created car for an admin', async () => {
    const res = await request(app)
      .post('/api/cars')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        make: 'Toyota',
        model: 'Camry',
        year: 2024,
        price: 30000,
        status: 'available',
        vin: '1HGCM82633A123456',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('make', 'Toyota');
    expect(res.body).toHaveProperty('model', 'Camry');
    expect(res.body).toHaveProperty('year', 2024);
    expect(res.body).toHaveProperty('price', 30000);
    expect(res.body).toHaveProperty('status', 'available');
    expect(res.body).toHaveProperty('vin', '1HGCM82633A123456');
  });

  it('PUT /api/cars/:id returns 200 and the updated car for an admin', async () => {
    const createRes = await request(app)
      .post('/api/cars')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        make: 'Toyota',
        model: 'Camry',
        year: 2024,
        price: 30000,
        status: 'available',
        vin: '1HGCM82633A123456',
      });

    const carId = createRes.body._id;

    const res = await request(app)
      .put(`/api/cars/${carId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        make: 'Honda',
        model: 'Accord',
        year: 2025,
        price: 35000,
        status: 'sold',
        vin: '2HGCM82633A654321',
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('make', 'Honda');
    expect(res.body).toHaveProperty('model', 'Accord');
    expect(res.body).toHaveProperty('year', 2025);
    expect(res.body).toHaveProperty('price', 35000);
    expect(res.body).toHaveProperty('status', 'sold');
    expect(res.body).toHaveProperty('vin', '2HGCM82633A654321');
  });

  it('DELETE /api/cars/:id returns 200 when deleted by an admin', async () => {
    const createRes = await request(app)
      .post('/api/cars')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        make: 'Toyota',
        model: 'Camry',
        year: 2024,
        price: 30000,
        status: 'available',
        vin: '1HGCM82633A123456',
      });

    const carId = createRes.body._id;

    const res = await request(app)
      .delete(`/api/cars/${carId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
  });
});