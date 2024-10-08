const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const faker = require('faker');
const ApproveHistory = require('../../../src/models/approveHistory.model');
const { User } = require('../../../src/models'); 
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

describe('ApproveHistory model', () => {
  describe('ApproveHistory validation', () => {
    let newApproveHistory;
    let userId;
    let documentId;
    beforeEach(async () => {
      const user = await User.create({
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      });
      userId = user._id;

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

      newApproveHistory = {
        userId, 
        documentId, 
        beforeStatus: faker.lorem.word(),
        afterStatus: faker.lorem.word(),
      };
    });

    test('should correctly validate a valid approve history', async () => {
      await expect(new ApproveHistory(newApproveHistory).validate()).resolves.toBeUndefined();
    });

    test('should throw a validation error if userId is missing', async () => {
      newApproveHistory.userId = undefined;
      await expect(new ApproveHistory(newApproveHistory).validate()).rejects.toThrow();
    });

    test('should throw a validation error if documentId is missing', async () => {
      newApproveHistory.documentId = undefined;
      await expect(new ApproveHistory(newApproveHistory).validate()).rejects.toThrow();
    });

    test('should throw a validation error if beforeStatus is missing', async () => {
      newApproveHistory.beforeStatus = undefined;
      await expect(new ApproveHistory(newApproveHistory).validate()).rejects.toThrow();
    });

    test('should throw a validation error if afterStatus is missing', async () => {
      newApproveHistory.afterStatus = undefined;
      await expect(new ApproveHistory(newApproveHistory).validate()).rejects.toThrow();
    });
  });

  describe('ApproveHistory toJSON()', () => {
    test('should not return __v when toJSON is called', () => {
      const newApproveHistory = {
        userId: new mongoose.Types.ObjectId(),
        documentId: new mongoose.Types.ObjectId(),
        beforeStatus: faker.lorem.word(),
        afterStatus: faker.lorem.word(),
      };
      expect(new ApproveHistory(newApproveHistory).toJSON()).not.toHaveProperty('__v');
    });
  });
});