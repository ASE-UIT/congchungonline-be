// notarizationService.route.test.js
const request = require('supertest');
const express = require('express');
const auth = require('../../../src/middlewares/auth');
const validate = require('../../../src/middlewares/validate');
const notarizationServiceValidation = require('../../../src/validations/notarizationService.validation');
const notarizationServiceController = require('../../../src/controllers/notarizationService.controller');
const notarizationServiceRoutes = require('../../../src/routes/v1/notarizationService.route');

jest.mock('../../../src/middlewares/auth', () => jest.fn(() => (req, res, next) => next()));
jest.mock('../../../src/middlewares/validate', () => jest.fn(() => (req, res, next) => next()));
jest.mock('../../../src/validations/notarizationService.validation', () => ({
  createNotarizationService: jest.fn(),
  updateNotarizationService: jest.fn(),
}));
jest.mock('../../../src/controllers/notarizationService.controller', () => ({
  createNotarizationService: jest.fn((req, res) => res.status(201).send({ id: '12345', ...req.body })),
  getNotarizationService: jest.fn((req, res) => res.status(200).send({ id: req.params.serviceId, name: 'Test Service' })),
  getAllNotarizationServices: jest.fn((req, res) => res.status(200).send([{ id: '12345', name: 'Test Service' }])),
  updateNotarizationService: jest.fn((req, res) => res.status(200).send({ id: req.params.serviceId, ...req.body })),
  deleteNotarizationService: jest.fn((req, res) =>
    res.status(200).json({ message: 'Notarization service deleted successfully' })
  ),
  getNotarizationServicesByFieldId: jest.fn((req, res) =>
    res.status(200).send([{ id: '12345', fieldId: req.params.fieldId, name: 'Test Service' }])
  ),
}));

const app = express();
app.use(express.json());
app.use('/v1/notarization-services', notarizationServiceRoutes);

describe('Notarization Service Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /v1/notarization-services/create-notarization-service nên trả về 201', async () => {
    await request(app)
      .post('/v1/notarization-services/create-notarization-service')
      .send({ name: 'Test Service', fieldId: '5f2b2b23c3a2b16f2e143b67', description: 'Test Description', price: 10000 })
      .expect(201);
  });

  test('GET /v1/notarization-services/get-all-notarization-services nên trả về 200', async () => {
    await request(app).get('/v1/notarization-services/get-all-notarization-services').expect(200);
  });

  test('GET /v1/notarization-services/get-notarization-service/:serviceId nên trả về 200', async () => {
    await request(app).get('/v1/notarization-services/get-notarization-service/12345').expect(200);
  });

  test('PATCH /v1/notarization-services/update-notarization-service/:serviceId nên trả về 200', async () => {
    await request(app)
      .patch('/v1/notarization-services/update-notarization-service/12345')
      .send({ name: 'Updated Service' })
      .expect(200);
  });

  test('DELETE /v1/notarization-services/delete-notarization-service/:serviceId nên trả về 200', async () => {
    await request(app).delete('/v1/notarization-services/delete-notarization-service/12345').expect(200);
  });

  test('GET /v1/notarization-services/get-notarization-services-by-field-id/:fieldId nên trả về 200', async () => {
    await request(app)
      .get('/v1/notarization-services/get-notarization-services-by-field-id/5f2b2b23c3a2b16f2e143b67')
      .expect(200);
  });
});
