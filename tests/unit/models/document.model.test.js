const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const faker = require('faker');
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

describe('Document model', () => {
  describe('Document validation', () => {
    let newDocument;
    beforeEach(() => {
      newDocument = {
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
      };
    });

    test('should correctly validate a valid document', async () => {
      await expect(new Document(newDocument).validate()).resolves.toBeUndefined();
    });

    test('should throw a validation error if files is missing', async () => {
      newDocument.files = undefined;
      await expect(new Document(newDocument).validate()).rejects.toThrow();
    });

    test('should throw a validation error if notaryService is missing', async () => {
      newDocument.notaryService = undefined;
      await expect(new Document(newDocument).validate()).rejects.toThrow();
    });

    test('should throw a validation error if notaryField is missing', async () => {
      newDocument.notaryField = undefined;
      await expect(new Document(newDocument).validate()).rejects.toThrow();
    });

    test('should throw a validation error if requesterInfo is missing', async () => {
      newDocument.requesterInfo = undefined;
      await expect(new Document(newDocument).validate()).rejects.toThrow();
    });

    test('should throw a validation error if userId is missing', async () => {
      newDocument.userId = undefined;
      await expect(new Document(newDocument).validate()).rejects.toThrow();
    });
  });

  describe('Document toJSON()', () => {
    test('should not return __v when toJSON is called', () => {
      const newDocument = {
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
      };
      expect(new Document(newDocument).toJSON()).not.toHaveProperty('__v');
    });
  });
});