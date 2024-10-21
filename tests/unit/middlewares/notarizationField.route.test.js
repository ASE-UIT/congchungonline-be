// notarizationField.route.test.js
const request = require('supertest');
const express = require('express');
const auth = require('../../../src/middlewares/auth');
const validate = require('../../../src/middlewares/validate');
const notarizationFieldValidation = require('../../../src/validations/notarizationField.validation');
const notarizationFieldController = require('../../../src/controllers/notarizationField.controller');
const notarizationFieldRoutes = require('../../../src/routes/v1/notarizationField.route');

jest.mock('../../../src/middlewares/auth', () => jest.fn(() => (req, res, next) => next()));
jest.mock('../../../src/middlewares/validate', () => jest.fn(() => (req, res, next) => next()));
jest.mock('../../../src/validations/notarizationField.validation', () => ({
  createNotarizationField: jest.fn(),
  updateNotarizationField: jest.fn(),
}));
jest.mock('../../../src/controllers/notarizationField.controller', () => ({
  createNotarizationField: jest.fn((req, res) => res.status(201).send({ id: '12345', ...req.body })),
  getNotarizationField: jest.fn((req, res) => res.status(200).send({ id: req.params.fieldId, name: 'Test Field' })),
  getAllNotarizationFields: jest.fn((req, res) => res.status(200).send([{ id: '12345', name: 'Test Field' }])),
  updateNotarizationField: jest.fn((req, res) => res.status(200).send({ id: req.params.fieldId, ...req.body })),
  deleteNotarizationField: jest.fn((req, res) =>
    res.status(200).json({ message: 'Notarization field deleted successfully' })
  ),
}));

const app = express();
app.use(express.json());
app.use('/v1/notarization-fields', notarizationFieldRoutes);

describe('Notarization Field Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /v1/notarization-fields/create-notarization-field nên trả về 201', async () => {
    await request(app)
      .post('/v1/notarization-fields/create-notarization-field')
      .send({ name: 'Test Field', description: 'Test Description' })
      .expect(201);
  });

  test('GET /v1/notarization-fields/get-all-notarization-fields nên trả về 200', async () => {
    await request(app).get('/v1/notarization-fields/get-all-notarization-fields').expect(200);
  });

  test('GET /v1/notarization-fields/get-notarization-field/:fieldId nên trả về 200', async () => {
    await request(app).get('/v1/notarization-fields/get-notarization-field/12345').expect(200);
  });

  test('PATCH /v1/notarization-fields/update-notarization-field/:fieldId nên trả về 200', async () => {
    await request(app)
      .patch('/v1/notarization-fields/update-notarization-field/12345')
      .send({ name: 'Updated Field' })
      .expect(200);
  });

  test('DELETE /v1/notarization-fields/delete-notarization-field/:fieldId nên trả về 200', async () => {
    await request(app).delete('/v1/notarization-fields/delete-notarization-field/12345').expect(200);
  });
});
