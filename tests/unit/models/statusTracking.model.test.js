const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const faker = require('faker');
const StatusTracking = require('../../../src/models/statusTracking.model');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('StatusTracking model', () => {
  describe('StatusTracking validation', () => {
    let newStatusTracking;
    beforeEach(() => {
      newStatusTracking = {
        documentId: new mongoose.Types.ObjectId(),
        status: 'pending',
        updatedAt: new Date(),
      };
    });

    test('should correctly validate a valid status tracking', async () => {
      await expect(new StatusTracking(newStatusTracking).validate()).resolves.toBeUndefined();
    });

    test('should throw a validation error if documentId is missing', async () => {
      newStatusTracking.documentId = undefined;
      await expect(new StatusTracking(newStatusTracking).validate()).rejects.toThrow();
    });

    test('should throw a validation error if status is missing', async () => {
      newStatusTracking.status = undefined;
      await expect(new StatusTracking(newStatusTracking).validate()).rejects.toThrow();
    });

    test('should throw a validation error if updatedAt is missing', async () => {
      newStatusTracking.updatedAt = undefined;
      await expect(new StatusTracking(newStatusTracking).validate()).rejects.toThrow();
    });
  });

  describe('StatusTracking toJSON()', () => {
    test('should not return __v when toJSON is called', () => {
      const newStatusTracking = {
        documentId: new mongoose.Types.ObjectId(),
        status: 'pending',
        updatedAt: new Date(),
      };
      expect(new StatusTracking(newStatusTracking).toJSON()).not.toHaveProperty('__v');
    });
  });
});
