const request = require('supertest');
const app = require('../app');
const { protect, authorize } = require('../middleware/authMiddleware');

app.get('/api/test/protected', protect, (req, res) => {
  res.status(200).json({ message: 'ok' });
});

app.get('/api/test/admin', protect, authorize('admin'), (req, res) => {
  res.status(200).json({ message: 'ok' });
});

describe('Auth middleware', () => {
  describe('GET /api/test/protected', () => {
    it('returns 401 No token provided if Authorization header is missing', async () => {
      const res = await request(app).get('/api/test/protected');

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message', 'No token provided');
    });

    it('returns 401 Invalid or expired token for malformed JWT tokens', async () => {
      const res = await request(app)
        .get('/api/test/protected')
        .set('Authorization', 'Bearer malformed.token');

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message', 'Invalid or expired token');
    });
  });

  describe('GET /api/test/admin', () => {
    it('returns 403 Access denied when a standard user tries to access an admin-only route', async () => {
      await request(app).post('/api/auth/register').send({
        name: 'User One',
        email: 'user1@example.com',
        password: 'Password123!',
      });

      const loginRes = await request(app).post('/api/auth/login').send({
        email: 'user1@example.com',
        password: 'Password123!',
      });

      const res = await request(app)
        .get('/api/test/admin')
        .set('Authorization', `Bearer ${loginRes.body.token}`);

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty('message', 'Access denied');
    });

    it('passes through and returns 200 when a valid admin token is used', async () => {
      await require('../models/User').create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'Password123!',
        role: 'admin',
      });

      const loginRes = await request(app).post('/api/auth/login').send({
        email: 'admin@example.com',
        password: 'Password123!',
      });

      const res = await request(app)
        .get('/api/test/admin')
        .set('Authorization', `Bearer ${loginRes.body.token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'ok');
    });
  });
});