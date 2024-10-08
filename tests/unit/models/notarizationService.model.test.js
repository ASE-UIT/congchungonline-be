const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const faker = require('faker');
const { NotarizationService } = require('../../../src/models');
const { NotarizationField } = require('../../../src/models');

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

describe('NotarizationService model', () => {
  describe('NotarizationService validation', () => {
    let newNotarizationService;
    let fieldId;
    beforeEach(async () => {
      // Tạo một NotarizationField giả để tham chiếu
      const field = await NotarizationField.create({ name: faker.name.jobType() });
      fieldId = field._id;

      newNotarizationService = {
        name: faker.company.companyName(), 
        fieldId, 
        description: faker.lorem.sentence(), 
      };
    });

    test('should correctly validate a valid notarization service', async () => {
      await expect(new NotarizationService(newNotarizationService).validate()).resolves.toBeUndefined();
    });

    test('should throw a validation error if name is missing', async () => {
      newNotarizationService.name = undefined;
      await expect(new NotarizationService(newNotarizationService).validate()).rejects.toThrow();
    });

    test('should throw a validation error if fieldId is missing', async () => {
      newNotarizationService.fieldId = undefined;
      await expect(new NotarizationService(newNotarizationService).validate()).rejects.toThrow();
    });

    test('should throw a validation error if description is missing', async () => {
      newNotarizationService.description = undefined;
      await expect(new NotarizationService(newNotarizationService).validate()).rejects.toThrow();
    });
  });

  describe('NotarizationService toJSON()', () => {
    test('should not return __v when toJSON is called', () => {
      const newNotarizationService = {
        name: faker.company.companyName(), 
        fieldId: new mongoose.Types.ObjectId(),
        description: faker.lorem.sentence(), 
      };
      expect(new NotarizationService(newNotarizationService).toJSON()).not.toHaveProperty('__v');
    });
  });
});