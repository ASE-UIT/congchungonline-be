// user.routes.test.js
const request = require('supertest');
const express = require('express');
const auth = require('../../../src/middlewares/auth');
const validate = require('../../../src/middlewares/validate');
const userValidation = require('../../../src/validations/user.validation');
const userController = require('../../../src/controllers/user.controller');
const userRoutes = require('../../../src/routes/v1/user.route');

jest.mock('../../../src/middlewares/auth', () => jest.fn(() => (req, res, next) => next()));
jest.mock('../../../src/middlewares/validate', () => jest.fn(() => (req, res, next) => next()));
jest.mock('../../../src/validations/user.validation', () => ({
  createUser: jest.fn(),
  getUsers: jest.fn(),
  getUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  searchUserByEmail: jest.fn(),
}));
jest.mock('../../../src/controllers/user.controller', () => ({
  createUser: jest.fn((req, res) => res.status(201).send()),
  getUsers: jest.fn((req, res) => res.status(200).send()),
  getUser: jest.fn((req, res) => res.status(200).send()),
  updateUser: jest.fn((req, res) => res.status(200).send()),
  deleteUser: jest.fn((req, res) => res.status(204).send()),
  searchUserByEmail: jest.fn((req, res) => res.status(200).send()),
}));

const app = express();
app.use(express.json());
app.use('/v1/users', userRoutes);

describe('User Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /v1/users nên trả về 201', async () => {
    await request(app)
      .post('/v1/users')
      .send({ name: 'John Doe', email: 'john@example.com', password: 'password1', role: 'user' })
      .expect(201);
  });

  test('GET /v1/users nên trả về 200', async () => {
    await request(app).get('/v1/users').expect(200);
  });

  test('GET /v1/users/:userId nên trả về 200', async () => {
    await request(app).get('/v1/users/123').expect(200);
  });

  test('PATCH /v1/users/:userId nên trả về 200', async () => {
    await request(app).patch('/v1/users/123').send({ name: 'John Doe Updated' }).expect(200);
  });

  test('DELETE /v1/users/:userId nên trả về 204', async () => {
    await request(app).delete('/v1/users/123').expect(204);
  });

  test('GET /v1/users/search-user-by-email/:email nên trả về 200', async () => {
    await request(app).get('/v1/users/search-user-by-email/test@example.com').expect(200);
  });
});
