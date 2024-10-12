const setupTestDB = require('../../utils/setupTestDB');
const mockFirebase = require('./firebase.mock');

setupTestDB();
mockFirebase();

const request = require('supertest');
const express = require('express');
const httpStatus = require('http-status');
const { adminService } = require('../../../src/services');
const adminController = require('../../../src/controllers/admin.controller');
const catchAsync = require('../../../src/utils/catchAsync');

jest.mock('../../../src/services/admin.service');
jest.mock('../../../src/utils/catchAsync', () => (fn) => (req, res, next) => fn(req, res, next).catch(next));

const app = express();
app.use(express.json());
app.get('/today-document-count', adminController.getToDayDocumentCount);
app.get('/today-user-count', adminController.getToDayUserCount);
app.get('/user-monthly', adminController.getUserMonthly);
app.get('/today-documents-by-notary-field', adminController.getTodayDocumentsByNotaryField);
app.get('/month-documents-by-notary-field', adminController.getMonthDocumentsByNotaryField);
app.get('/daily-session-count', adminController.getDailySessionCount);
app.get('/monthly-session-count', adminController.getMonthlySessionCount);

describe('Admin Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /today-document-count', () => {
    it("should return today's document count", async () => {
      const toDayDocumentCount = { toDayDocumentCount: 10, percentDocumentGrowth: 50 };
      adminService.getToDayDocumentCount.mockResolvedValue(toDayDocumentCount);

      const res = await request(app).get('/today-document-count').send();

      expect(res.status).toBe(httpStatus.OK);
      expect(res.body).toEqual(toDayDocumentCount);
      expect(adminService.getToDayDocumentCount).toHaveBeenCalled();
    });
  });

  describe('GET /today-user-count', () => {
    it("should return today's user count", async () => {
      const toDayUserCount = { toDayUserCount: 5, percentUserGrowth: 20 };
      adminService.getToDayUserCount.mockResolvedValue(toDayUserCount);

      const res = await request(app).get('/today-user-count').send();

      expect(res.status).toBe(httpStatus.OK);
      expect(res.body).toEqual(toDayUserCount);
      expect(adminService.getToDayUserCount).toHaveBeenCalled();
    });
  });

  describe('GET /user-monthly', () => {
    it('should return user count for this month and last month', async () => {
      const userMonthly = { userThisMonthCount: 20, userLastMonthCount: 15 };
      adminService.getUserMonthly.mockResolvedValue(userMonthly);

      const res = await request(app).get('/user-monthly').send();

      expect(res.status).toBe(httpStatus.OK);
      expect(res.body).toEqual(userMonthly);
      expect(adminService.getUserMonthly).toHaveBeenCalled();
    });
  });

  describe('GET /today-documents-by-notary-field', () => {
    it("should return today's documents grouped by notary field", async () => {
      const todayDocumentsByNotaryField = [
        { _id: 'field1', count: 5 },
        { _id: 'field2', count: 3 },
      ];
      adminService.getTodayDocumentsByNotaryField.mockResolvedValue(todayDocumentsByNotaryField);

      const res = await request(app).get('/today-documents-by-notary-field').send();

      expect(res.status).toBe(httpStatus.OK);
      expect(res.body).toEqual(todayDocumentsByNotaryField);
      expect(adminService.getTodayDocumentsByNotaryField).toHaveBeenCalled();
    });
  });

  describe('GET /month-documents-by-notary-field', () => {
    it("should return this month's documents grouped by notary field", async () => {
      const monthDocumentsByNotaryField = [
        { _id: 'field1', count: 10 },
        { _id: 'field2', count: 8 },
      ];
      adminService.getMonthDocumentsByNotaryField.mockResolvedValue(monthDocumentsByNotaryField);

      const res = await request(app).get('/month-documents-by-notary-field').send();

      expect(res.status).toBe(httpStatus.OK);
      expect(res.body).toEqual(monthDocumentsByNotaryField);
      expect(adminService.getMonthDocumentsByNotaryField).toHaveBeenCalled();
    });
  });

  describe('GET /daily-session-count', () => {
    it("should return today's session count", async () => {
      const dailySessionCount = 100;
      adminService.getDailySessionCount.mockResolvedValue(dailySessionCount);

      const res = await request(app).get('/daily-session-count').send();

      expect(res.status).toBe(httpStatus.OK);
      expect(res.body).toEqual({ dailySessionCount });
      expect(adminService.getDailySessionCount).toHaveBeenCalled();
    });
  });

  describe('GET /monthly-session-count', () => {
    it("should return this month's session count", async () => {
      const monthlySessionCount = 3000;
      adminService.getMonthlySessionCount.mockResolvedValue(monthlySessionCount);

      const res = await request(app).get('/monthly-session-count').send();

      expect(res.status).toBe(httpStatus.OK);
      expect(res.body).toEqual({ monthlySessionCount });
      expect(adminService.getMonthlySessionCount).toHaveBeenCalled();
    });
  });
});
