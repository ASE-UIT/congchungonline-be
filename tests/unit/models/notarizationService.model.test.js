// notarizationService.model.test.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const NotarizationService = require('../../../src/models/notarizationService.model');

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

describe('NotarizationService Model', () => {
  beforeEach(async () => {
    await NotarizationService.deleteMany({});
  });

  test('should correctly apply the toJSON plugin', async () => {
    const notarizationService = await NotarizationService.create({
      name: 'Test Service',
      fieldId: new mongoose.Types.ObjectId(),
      description: 'Test Description',
      price: 100,
    });

    const jsonNotarizationService = notarizationService.toJSON();
    expect(jsonNotarizationService).not.toHaveProperty('_id');
    expect(jsonNotarizationService).not.toHaveProperty('__v');
    expect(jsonNotarizationService).toHaveProperty('id', notarizationService._id.toString());
  });

  test('should correctly apply the paginate plugin', async () => {
    const fieldId = new mongoose.Types.ObjectId();
    await NotarizationService.create([
      { name: 'Service 1', fieldId, description: 'Description 1', price: 100 },
      { name: 'Service 2', fieldId, description: 'Description 2', price: 200 },
      { name: 'Service 3', fieldId, description: 'Description 3', price: 300 },
    ]);

    const result = await NotarizationService.paginate({}, { page: 1, limit: 2 });
    expect(result.results).toHaveLength(2);
    expect(result.totalResults).toBe(3);
    expect(result.totalPages).toBe(2);
    expect(result.page).toBe(1);
  });

  test('should throw validation error if required fields are missing', async () => {
    const notarizationService = new NotarizationService({
      name: 'Test Service',
      description: 'Test Description',
      price: 100,
    });

    let err;
    try {
      await notarizationService.validate();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.fieldId).toBeDefined();
  });
});
