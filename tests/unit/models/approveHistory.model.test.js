const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const ApproveHistory = require('../../../src/models/approveHistory.model');

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

describe('ApproveHistory Model', () => {
  describe('ApproveHistory validation', () => {
    let newApproveHistory;
    beforeEach(() => {
      newApproveHistory = {
        userId: new mongoose.Types.ObjectId(),
        documentId: new mongoose.Types.ObjectId(),
        beforeStatus: 'pending',
        afterStatus: 'approved',
      };
    });

    test('should correctly validate a valid approve history', async () => {
      await expect(new ApproveHistory(newApproveHistory).validate()).resolves.toBeUndefined();
    });

    test('should throw a validation error if userId is missing', async () => {
      newApproveHistory.userId = undefined;
      await expect(new ApproveHistory(newApproveHistory).validate()).rejects.toThrow(mongoose.Error.ValidationError);
    });

    test('should throw a validation error if documentId is missing', async () => {
      newApproveHistory.documentId = undefined;
      await expect(new ApproveHistory(newApproveHistory).validate()).rejects.toThrow(mongoose.Error.ValidationError);
    });

    test('should throw a validation error if beforeStatus is missing', async () => {
      newApproveHistory.beforeStatus = undefined;
      await expect(new ApproveHistory(newApproveHistory).validate()).rejects.toThrow(mongoose.Error.ValidationError);
    });

    test('should throw a validation error if afterStatus is missing', async () => {
      newApproveHistory.afterStatus = undefined;
      await expect(new ApproveHistory(newApproveHistory).validate()).rejects.toThrow(mongoose.Error.ValidationError);
    });
  });
});
