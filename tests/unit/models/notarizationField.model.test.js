const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const faker = require('faker');
const { NotarizationField } = require('../../../src/models');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Tạo chỉ mục unique trên trường name
  await NotarizationField.createIndexes();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('NotarizationField model', () => {
  describe('NotarizationField validation', () => {
    let newNotarizationField;
    beforeEach(() => {
      newNotarizationField = {
        name: faker.company.companyName(),
      };
    });

    test('should correctly validate a valid notarization field', async () => {
      await expect(new NotarizationField(newNotarizationField).validate()).resolves.toBeUndefined();
    });

    test('should throw a validation error if name is missing', async () => {
      newNotarizationField.name = undefined;
      await expect(new NotarizationField(newNotarizationField).validate()).rejects.toThrow();
    });

    test('should throw a validation error if name is not unique', async () => {
      await new NotarizationField(newNotarizationField).save();
      const duplicateNotarizationField = new NotarizationField(newNotarizationField);
      await expect(duplicateNotarizationField.save()).rejects.toThrow();
    });
  });

  describe('NotarizationField toJSON()', () => {
    test('should not return __v when toJSON is called', () => {
      const newNotarizationField = {
        name: faker.company.companyName(),
      };
      expect(new NotarizationField(newNotarizationField).toJSON()).not.toHaveProperty('__v');
    });
  });
});
