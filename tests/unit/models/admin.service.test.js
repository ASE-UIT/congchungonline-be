const { Document, User, Session } = require('../../../src/models');
const moment = require('moment');
const adminService = require('../../../src/services/admin.service');

jest.mock('../../../src/models');

describe('Admin Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getToDayDocumentCount', () => {
    it("should return today's document count and percent growth", async () => {
      const toDayDocumentCount = 10;
      const yesterdayDocumentCount = 5;

      Document.count.mockResolvedValueOnce(toDayDocumentCount).mockResolvedValueOnce(yesterdayDocumentCount);

      const result = await adminService.getToDayDocumentCount();

      expect(Document.count).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        toDayDocumentCount,
        percentDocumentGrowth: (toDayDocumentCount - yesterdayDocumentCount) / yesterdayDocumentCount,
      });
    });

    it('should return 100% growth if there were no documents yesterday', async () => {
      const toDayDocumentCount = 10;
      const yesterdayDocumentCount = 0;

      Document.count.mockResolvedValueOnce(toDayDocumentCount).mockResolvedValueOnce(yesterdayDocumentCount);

      const result = await adminService.getToDayDocumentCount();

      expect(Document.count).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        toDayDocumentCount,
        percentDocumentGrowth: 100,
      });
    });
  });

  describe('getToDayUserCount', () => {
    it("should return today's user count and percent growth", async () => {
      const toDayUserCount = 10;
      const yesterdayUserCount = 5;

      User.count.mockResolvedValueOnce(toDayUserCount).mockResolvedValueOnce(yesterdayUserCount);

      const result = await adminService.getToDayUserCount();

      expect(User.count).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        toDayUserCount,
        percentUserGrowth: (toDayUserCount - yesterdayUserCount) / yesterdayUserCount,
      });
    });

    it('should return 100% growth if there were no users yesterday', async () => {
      const toDayUserCount = 10;
      const yesterdayUserCount = 0;

      User.count.mockResolvedValueOnce(toDayUserCount).mockResolvedValueOnce(yesterdayUserCount);

      const result = await adminService.getToDayUserCount();

      expect(User.count).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        toDayUserCount,
        percentUserGrowth: 100,
      });
    });
  });

  describe('getUserMonthly', () => {
    it('should return user count for this month and last month', async () => {
      const userThisMonthCount = 20;
      const userLastMonthCount = 15;

      User.count.mockResolvedValueOnce(userThisMonthCount).mockResolvedValueOnce(userLastMonthCount);

      const result = await adminService.getUserMonthly();

      expect(User.count).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        userThisMonthCount,
        userLastMonthCount,
      });
    });
  });

  describe('getTodayDocumentsByNotaryField', () => {
    it("should return today's documents grouped by notary field", async () => {
      const todayDocumentsByNotaryField = [
        { _id: 'field1', count: 5 },
        { _id: 'field2', count: 3 },
      ];

      Document.aggregate.mockResolvedValue(todayDocumentsByNotaryField);

      const result = await adminService.getTodayDocumentsByNotaryField();

      expect(Document.aggregate).toHaveBeenCalledWith([
        { $match: { createdAt: { $gte: expect.any(Date), $lte: expect.any(Date) } } },
        { $group: { _id: '$notaryField', count: { $sum: 1 } } },
      ]);
      expect(result).toEqual({ todayDocumentsByNotaryField });
    });
  });

  describe('getMonthDocumentsByNotaryField', () => {
    it("should return this month's documents grouped by notary field", async () => {
      const monthDocumentsByNotaryField = [
        { _id: 'field1', count: 10 },
        { _id: 'field2', count: 8 },
      ];

      Document.aggregate.mockResolvedValue(monthDocumentsByNotaryField);

      const result = await adminService.getMonthDocumentsByNotaryField();

      expect(Document.aggregate).toHaveBeenCalledWith([
        { $match: { createdAt: { $gte: moment().startOf('month').toDate(), $lte: moment().endOf('month').toDate() } } },
        { $group: { _id: '$notaryField', count: { $sum: 1 } } },
      ]);
      expect(result).toEqual({ monthDocumentsByNotaryField });
    });
  });

  describe('getDailySessionCount', () => {
    it("should return today's session count", async () => {
      const dailySessionCount = 100;

      Session.countDocuments.mockResolvedValue(dailySessionCount);

      const result = await adminService.getDailySessionCount();

      expect(Session.countDocuments).toHaveBeenCalledWith({
        createdAt: { $gte: expect.any(Date), $lte: expect.any(Date) },
      });
      expect(result).toEqual(dailySessionCount);
    });
  });

  describe('getMonthlySessionCount', () => {
    it("should return this month's session count", async () => {
      const monthlySessionCount = 3000;

      Session.countDocuments.mockResolvedValue(monthlySessionCount);

      const result = await adminService.getMonthlySessionCount();

      expect(Session.countDocuments).toHaveBeenCalledWith({
        createdAt: { $gte: expect.any(Date), $lte: expect.any(Date) },
      });
      expect(result).toEqual(monthlySessionCount);
    });
  });
});
