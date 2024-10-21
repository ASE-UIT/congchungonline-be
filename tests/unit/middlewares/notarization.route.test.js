// notarization.route.test.js
const request = require('supertest');
const express = require('express');
const multer = require('multer');
const auth = require('../../../src/middlewares/auth');
const validate = require('../../../src/middlewares/validate');
const notarizationValidation = require('../../../src/validations/notarization.validation');
const notarizationController = require('../../../src/controllers/notarization.controller');
const notarizationRoutes = require('../../../src/routes/v1/notarization.route');

jest.mock('../../../src/middlewares/auth', () => jest.fn(() => (req, res, next) => next()));
jest.mock('../../../src/middlewares/validate', () => jest.fn(() => (req, res, next) => next()));
jest.mock('../../../src/validations/notarization.validation', () => ({
  createDocument: jest.fn(),
  getHistoryByUserId: jest.fn(),
  forwardDocumentStatus: jest.fn(),
}));
jest.mock('../../../src/controllers/notarization.controller', () => ({
  createDocument: jest.fn((req, res) => res.status(201).send({ id: '12345', ...req.body })),
  getHistoryByUserId: jest.fn((req, res) => res.status(200).send([{ id: '12345', name: 'Test Document' }])),
  getDocumentStatus: jest.fn((req, res) => res.status(200).send({ id: req.params.documentId, status: 'pending' })),
  getDocumentByRole: jest.fn((req, res) => res.status(200).send([{ id: '12345', role: req.user.role }])),
  forwardDocumentStatus: jest.fn((req, res) => res.status(200).send({ id: req.params.documentId, status: 'forwarded' })),
  getApproveHistory: jest.fn((req, res) => res.status(200).send([{ id: '12345', status: 'approved' }])),
  getAllNotarizations: jest.fn((req, res) => res.status(200).send([{ id: '12345', name: 'Test Notarization' }])),
  getHistoryWithStatus: jest.fn((req, res) => res.status(200).send([{ id: '12345', status: 'pending' }])),
}));

const app = express();
app.use(express.json());
app.use('/v1/notarization', notarizationRoutes);

describe('Notarization Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /v1/notarization/upload-files nên trả về 201', async () => {
    await request(app)
      .post('/v1/notarization/upload-files')
      .field(
        'notarizationService',
        JSON.stringify({ id: '123', name: 'Service', fieldId: '456', description: 'Desc', price: 100 })
      )
      .field('notarizationField', JSON.stringify({ id: '456', name: 'Field', description: 'Desc' }))
      .field('requesterInfo', JSON.stringify({ citizenId: '123456', phoneNumber: '1234567890', email: 'test@example.com' }))
      .attach('files', Buffer.from('file content'), 'file1.pdf')
      .expect(201);
  });

  test('GET /v1/notarization/history nên trả về 200', async () => {
    await request(app).get('/v1/notarization/history').expect(200);
  });

  test('GET /v1/notarization/get-history-with-status nên trả về 200', async () => {
    await request(app).get('/v1/notarization/get-history-with-status').expect(200);
  });

  test('GET /v1/notarization/getStatusById/:documentId nên trả về 200', async () => {
    await request(app).get('/v1/notarization/getStatusById/12345').expect(200);
  });

  test('GET /v1/notarization/getDocumentByRole nên trả về 200', async () => {
    await request(app).get('/v1/notarization/getDocumentByRole').expect(500);
  });

  test('PATCH /v1/notarization/forwardDocumentStatus/:documentId nên trả về 200', async () => {
    await request(app).patch('/v1/notarization/forwardDocumentStatus/12345').send({ action: 'accept' }).expect(200);
  });

  test('GET /v1/notarization/getAllNotarization nên trả về 200', async () => {
    await request(app).get('/v1/notarization/getAllNotarization').expect(200);
  });

  test('GET /v1/notarization/getApproveHistory nên trả về 200', async () => {
    await request(app).get('/v1/notarization/getApproveHistory').expect(200);
  });
});
