const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const faker = require('faker');
const { StatusTracking } = require('../../../src/models');
const { Document } = require('../../../src/models');

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
    let documentId;
    beforeEach(async () => {
      const document = await Document.create({
        files: [
          {
            filename: faker.system.fileName(),
            firebaseUrl: faker.internet.url(),
          },
        ],
        notaryService: faker.lorem.word(),
        notaryField: faker.lorem.word(),
        requesterInfo: {
          citizenId: faker.random.alphaNumeric(10),
          phoneNumber: faker.phone.phoneNumber(),
          email: faker.internet.email(),
        },
        userId: new mongoose.Types.ObjectId(),
      });
      documentId = document._id;

      newStatusTracking = {
        documentId,
        status: faker.lorem.word(),
        updatedAt: faker.date.recent(),
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
        status: faker.lorem.word(),
        updatedAt: faker.date.recent(),
      };
      expect(new StatusTracking(newStatusTracking).toJSON()).not.toHaveProperty('__v');
    });
  });
});