// session.route.test.js
const request = require('supertest');
const express = require('express');
const auth = require('../../../src/middlewares/auth');
const validate = require('../../../src/middlewares/validate');
const sessionValidation = require('../../../src/validations/session.validation');
const sessionController = require('../../../src/controllers/session.controller');
const sessionRoutes = require('../../../src/routes/v1/session.route');

jest.mock('../../../src/middlewares/auth', () => jest.fn(() => (req, res, next) => next()));
jest.mock('../../../src/middlewares/validate', () => jest.fn(() => (req, res, next) => next()));
jest.mock('../../../src/validations/session.validation', () => ({
  createSession: jest.fn(),
  addUserToSession: jest.fn(),
  deleteUserOutOfSession: jest.fn(),
  joinSession: jest.fn(),
  getSessionsByDate: jest.fn(),
  getSessionsByMonth: jest.fn(),
}));
jest.mock('../../../src/controllers/session.controller', () => ({
  createSession: jest.fn((req, res) => res.status(201).send({ id: '12345', ...req.body })),
  addUserToSession: jest.fn((req, res) => res.status(200).send({ id: req.params.sessionId, emails: req.body.emails })),
  deleteUserOutOfSession: jest.fn((req, res) => res.status(200).send({ id: req.params.sessionId, email: req.body.email })),
  joinSession: jest.fn((req, res) => res.status(200).send({ id: req.params.sessionId, action: req.body.action })),
  getAllSessions: jest.fn((req, res) => res.status(200).send([{ id: '12345', name: 'Test Session' }])),
  getSessionsByDate: jest.fn((req, res) => res.status(200).send([{ id: '12345', date: req.query.date }])),
  getSessionsByMonth: jest.fn((req, res) => res.status(200).send([{ id: '12345', date: req.query.date }])),
  getActiveSessions: jest.fn((req, res) => res.status(200).send([{ id: '12345', status: 'active' }])),
}));

const app = express();
app.use(express.json());
app.use('/v1/session', sessionRoutes);

describe('Session Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /v1/session/createSession nên trả về 201', async () => {
    await request(app)
      .post('/v1/session/createSession')
      .send({
        sessionName: 'Test Session',
        notaryField: { name: 'Field' },
        notaryService: { name: 'Service' },
        startDate: '2024-10-10',
        startTime: '14:00',
        endTime: '15:00',
        endDate: '2024-10-10',
        users: [{ email: 'test@example.com' }],
      })
      .expect(201);
  });

  test('PATCH /v1/session/addUser/:sessionId nên trả về 200', async () => {
    await request(app)
      .patch('/v1/session/addUser/12345')
      .send({ emails: ['test@example.com'] })
      .expect(200);
  });

  test('PATCH /v1/session/deleteUser/:sessionId nên trả về 200', async () => {
    await request(app).patch('/v1/session/deleteUser/12345').send({ email: 'test@example.com' }).expect(200);
  });

  test('POST /v1/session/joinSession/:sessionId nên trả về 200', async () => {
    await request(app).post('/v1/session/joinSession/12345').send({ action: 'accept' }).expect(200);
  });

  test('GET /v1/session/getAllSessions nên trả về 200', async () => {
    await request(app).get('/v1/session/getAllSessions').expect(200);
  });

  test('GET /v1/session/getSessionsByDate nên trả về 200', async () => {
    await request(app).get('/v1/session/getSessionsByDate').query({ date: '2024-10-10' }).expect(200);
  });

  test('GET /v1/session/getSessionsByMonth nên trả về 200', async () => {
    await request(app).get('/v1/session/getSessionsByMonth').query({ date: '2024-10' }).expect(200);
  });

  test('GET /v1/session/getActiveSessions nên trả về 200', async () => {
    await request(app).get('/v1/session/getActiveSessions').expect(200);
  });
});
