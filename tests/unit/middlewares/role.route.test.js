// role.route.test.js
const request = require('supertest');
const express = require('express');
const auth = require('../../../src/middlewares/auth');
const validate = require('../../../src/middlewares/validate');
const roleValidation = require('../../../src/validations/role.validation');
const roleController = require('../../../src/controllers/role.controller');
const roleRoutes = require('../../../src/routes/v1/role.route');

jest.mock('../../../src/middlewares/auth', () => jest.fn(() => (req, res, next) => next()));
jest.mock('../../../src/middlewares/validate', () => jest.fn(() => (req, res, next) => next()));
jest.mock('../../../src/validations/role.validation', () => ({
  createRole: jest.fn(),
  updateRole: jest.fn(),
}));
jest.mock('../../../src/controllers/role.controller', () => ({
  createRole: jest.fn((req, res) => res.status(201).send({ id: '12345', ...req.body })),
  getRoles: jest.fn((req, res) => res.status(200).send([{ id: '12345', name: 'Test Role' }])),
  getRole: jest.fn((req, res) => res.status(200).send({ id: req.params.roleId, name: 'Test Role' })),
  updateRole: jest.fn((req, res) => res.status(200).send({ id: req.params.roleId, ...req.body })),
  deleteRole: jest.fn((req, res) => res.status(204).send()),
}));

const app = express();
app.use(express.json());
app.use('/v1/role', roleRoutes);

describe('Role Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /v1/role/createRole nên trả về 201', async () => {
    await request(app)
      .post('/v1/role/createRole')
      .send({ name: 'Test Role', permissions: ['read', 'write'] })
      .expect(201);
  });

  test('GET /v1/role/getRoles nên trả về 200', async () => {
    await request(app).get('/v1/role/getRoles').expect(200);
  });

  test('GET /v1/role/getRole/:roleId nên trả về 200', async () => {
    await request(app).get('/v1/role/getRole/12345').expect(200);
  });

  test('PATCH /v1/role/updateRole/:roleId nên trả về 200', async () => {
    await request(app).patch('/v1/role/updateRole/12345').send({ name: 'Updated Role' }).expect(200);
  });

  test('DELETE /v1/role/deleteRole/:roleId nên trả về 204', async () => {
    await request(app).delete('/v1/role/deleteRole/12345').expect(204);
  });
});
