// notarizationField.model.test.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const NotarizationField = require('../../../src/models/notarizationField.model');

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

describe('NotarizationField Model', () => {
  beforeEach(async () => {
    await NotarizationField.deleteMany({});
  });

  test('should correctly apply the toJSON plugin', async () => {
    const notarizationField = await NotarizationField.create({
      name: 'Test Field',
      description: 'Test Description',
    });

    const jsonNotarizationField = notarizationField.toJSON();
    expect(jsonNotarizationField).not.toHaveProperty('_id');
    expect(jsonNotarizationField).not.toHaveProperty('__v');
    expect(jsonNotarizationField).toHaveProperty('id', notarizationField._id.toString());
  });

  test('should correctly apply the paginate plugin', async () => {
    await NotarizationField.create([
      { name: 'Field 1', description: 'Description 1' },
      { name: 'Field 2', description: 'Description 2' },
      { name: 'Field 3', description: 'Description 3' },
    ]);

    const result = await NotarizationField.paginate({}, { page: 1, limit: 2 });
    expect(result.results).toHaveLength(2);
    expect(result.totalResults).toBe(3);
    expect(result.totalPages).toBe(2);
    expect(result.page).toBe(1);
  });

  test('should throw validation error if required fields are missing', async () => {
    const notarizationField = new NotarizationField({
      description: 'Test Description',
    });

    let err;
    try {
      await notarizationField.validate();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.name).toBeDefined();
  });
});