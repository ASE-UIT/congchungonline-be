const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const faker = require('faker');
const Document = require('../../../src/models/document.model');

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
        notarizationServiceId: new mongoose.Types.ObjectId(),
        notarizationFieldId: new mongoose.Types.ObjectId(),
        requesterInfo: {
          citizenId: faker.datatype.uuid(),
          phoneNumber: faker.phone.phoneNumber(),
          email: faker.internet.email(),
        },
        userId: new mongoose.Types.ObjectId(),
      };
    });

    test('should correctly validate a valid document', async () => {
      await expect(new Document(newDocument).validate()).resolves.toBeUndefined();
    });

    test('should throw a validation error if notarizationServiceId is missing', async () => {
      newDocument.notarizationServiceId = undefined;
      await expect(new Document(newDocument).validate()).rejects.toThrow();
    });

    test('should throw a validation error if notarizationFieldId is missing', async () => {
      newDocument.notarizationFieldId = undefined;
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
        notarizationServiceId: new mongoose.Types.ObjectId(),
        notarizationFieldId: new mongoose.Types.ObjectId(),
        requesterInfo: {
          citizenId: faker.datatype.uuid(),
          phoneNumber: faker.phone.phoneNumber(),
          email: faker.internet.email(),
        },
        userId: new mongoose.Types.ObjectId(),
      };
      expect(new Document(newDocument).toJSON()).not.toHaveProperty('__v');
    });
  });
});
