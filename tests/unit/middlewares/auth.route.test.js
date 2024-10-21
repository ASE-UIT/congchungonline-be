// auth.route.test.js
const request = require('supertest');
const express = require('express');
const passport = require('passport');
const validate = require('../../../src/middlewares/validate');
const authValidation = require('../../../src/validations/auth.validation');
const authController = require('../../../src/controllers/auth.controller');
const auth = require('../../../src/middlewares/auth');
const authRoutes = require('../../../src/routes/v1/auth.route');

jest.mock('passport', () => ({
  authenticate: jest.fn((strategy, options, callback) => (req, res, next) => {
    if (callback) {
      callback(null, { email: 'john@example.com', password: 'password1' });
    } else {
      next();
    }
  }),
}));
jest.mock('../../../src/middlewares/validate', () => jest.fn(() => (req, res, next) => next()));
jest.mock('../../../src/validations/auth.validation', () => ({
  register: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
  refreshTokens: jest.fn(),
  forgotPassword: jest.fn(),
  resetPassword: jest.fn(),
  verifyEmail: jest.fn(),
}));
jest.mock('../../../src/controllers/auth.controller', () => ({
  register: jest.fn((req, res) => res.status(201).send({ user: {}, tokens: {} })),
  login: jest.fn((req, res) => res.status(200).send({ user: {}, tokens: {} })),
  logout: jest.fn((req, res) => res.status(204).send()),
  refreshTokens: jest.fn((req, res) => res.status(200).send({ tokens: {} })),
  forgotPassword: jest.fn((req, res) => res.status(204).send()),
  resetPassword: jest.fn((req, res) => res.status(204).send()),
  sendVerificationEmail: jest.fn((req, res) => res.status(204).send()),
  verifyEmail: jest.fn((req, res) => res.status(204).send()),
  loginWithGoogle: jest.fn((req, res) => res.status(200).send({ user: {}, tokens: {} })),
}));
jest.mock('../../../src/middlewares/auth', () => jest.fn(() => (req, res, next) => next()));

const app = express();
app.use(express.json());
app.use('/v1/auth', authRoutes);

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /v1/auth/register nên trả về 201', async () => {
    await request(app)
      .post('/v1/auth/register')
      .send({ name: 'John Doe', email: 'john@example.com', password: 'password1' })
      .expect(201);
  });

  test('POST /v1/auth/login nên trả về 200', async () => {
    await request(app).post('/v1/auth/login').send({ email: 'john@example.com', password: 'password1' }).expect(200);
  });

  test('POST /v1/auth/logout nên trả về 204', async () => {
    await request(app).post('/v1/auth/logout').send({ refreshToken: 'some-refresh-token' }).expect(204);
  });

  test('POST /v1/auth/refresh-tokens nên trả về 200', async () => {
    await request(app).post('/v1/auth/refresh-tokens').send({ refreshToken: 'some-refresh-token' }).expect(200);
  });

  test('POST /v1/auth/forgot-password nên trả về 204', async () => {
    await request(app).post('/v1/auth/forgot-password').send({ email: 'john@example.com' }).expect(204);
  });

  test('POST /v1/auth/reset-password nên trả về 204', async () => {
    await request(app)
      .post('/v1/auth/reset-password')
      .query({ token: 'some-reset-token' })
      .send({ password: 'newpassword1' })
      .expect(204);
  });

  test('POST /v1/auth/send-verification-email nên trả về 204', async () => {
    await request(app).post('/v1/auth/send-verification-email').expect(204);
  });

  test('POST /v1/auth/verify-email nên trả về 204', async () => {
    await request(app).post('/v1/auth/verify-email').query({ token: 'some-verify-token' }).expect(204);
  });

  test('GET /v1/auth/google nên trả về 404', async () => {
    passport.authenticate.mockImplementation((strategy, options) => (req, res, next) => {
      res.redirect('/auth/google/callback');
    });

    await request(app).get('/v1/auth/google').expect(404);
  });

  test('GET /v1/auth/google/callback nên trả về 200', async () => {
    passport.authenticate.mockImplementation((strategy, options, callback) => (req, res, next) => {
      req.user = { email: 'john@example.com', password: 'password1' };
      callback(null, req.user);
    });

    await request(app).get('/v1/auth/google/callback').expect(200);
  });
});
