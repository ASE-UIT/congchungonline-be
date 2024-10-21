// admin.route.test.js
const request = require('supertest');
const express = require('express');
const auth = require('../../../src/middlewares/auth');
const adminController = require('../../../src/controllers/admin.controller');
const adminRoutes = require('../../../src/routes/v1/admin.route');

jest.mock('../../../src/middlewares/auth', () => jest.fn(() => (req, res, next) => next()));
jest.mock('../../../src/controllers/admin.controller', () => ({
  getToDayDocumentCount: jest.fn((req, res) => res.status(200).send({ documentCount: 20, percentGrowth: 15.5 })),
  getToDayUserCount: jest.fn((req, res) => res.status(200).send({ userCount: 20, percentGrowth: 15.5 })),
  getUserMonthly: jest.fn((req, res) => res.status(200).send({ monthlyUserCount: 100 })),
  getTodayDocumentsByNotaryField: jest.fn((req, res) =>
    res.status(200).send({ todayDocumentsByNotaryField: [{ _id: 'Example Notary Field', count: 1 }] })
  ),
  getMonthDocumentsByNotaryField: jest.fn((req, res) =>
    res.status(200).send({ monthDocumentsByNotaryField: [{ _id: 'Example Notary Field', count: 30 }] })
  ),
  getEmployeeCount: jest.fn((req, res) => res.status(200).send({ notaryCount: 10 })),
  getEmployeeList: jest.fn((req, res) => res.status(200).send([{ id: 1, name: 'John Doe', role: 'notary' }])),
  getDailySessionCount: jest.fn((req, res) => res.status(200).send({ dailySessionCount: 5 })),
  getMonthlySessionCount: jest.fn((req, res) => res.status(200).send({ monthlySessionCount: 50 })),
}));

const app = express();
app.use(express.json());
app.use('/v1/admin', adminRoutes);

describe('Admin Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /v1/admin/documents/today nên trả về 200', async () => {
    await request(app).get('/v1/admin/documents/today').expect(200);
  });

  test('GET /v1/admin/users/today nên trả về 200', async () => {
    await request(app).get('/v1/admin/users/today').expect(200);
  });

  test('GET /v1/admin/users/monthly nên trả về 200', async () => {
    await request(app).get('/v1/admin/users/monthly').expect(200);
  });

  test('GET /v1/admin/documents/fields/daily nên trả về 200', async () => {
    await request(app).get('/v1/admin/documents/fields/daily').expect(200);
  });

  test('GET /v1/admin/documents/fields/monthly nên trả về 200', async () => {
    await request(app).get('/v1/admin/documents/fields/monthly').expect(200);
  });

  test('GET /v1/admin/employees/count nên trả về 200', async () => {
    await request(app).get('/v1/admin/employees/count').expect(200);
  });

  test('GET /v1/admin/employees/list nên trả về 200', async () => {
    await request(app).get('/v1/admin/employees/list').expect(200);
  });

  test('GET /v1/admin/sessions/daily nên trả về 200', async () => {
    await request(app).get('/v1/admin/sessions/daily').expect(200);
  });

  test('GET /v1/admin/sessions/monthly nên trả về 200', async () => {
    await request(app).get('/v1/admin/sessions/monthly').expect(200);
  });
});
