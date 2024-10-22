// session.model.test.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Session = require('../../../src/models/session.model');

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

describe('Session Model', () => {
  beforeEach(async () => {
    await Session.deleteMany({});
  });

  test('should correctly apply the toJSON plugin', async () => {
    const session = await Session.create({
      sessionName: 'Test Session',
      notaryField: { name: 'Field' },
      notaryService: { name: 'Service' },
      startTime: '14:00',
      startDate: new Date(),
      endTime: '15:00',
      endDate: new Date(),
      users: [{ email: 'test@example.com' }],
      createdBy: new mongoose.Types.ObjectId(),
    });

    const jsonSession = session.toJSON();
    expect(jsonSession).not.toHaveProperty('_id');
    expect(jsonSession).not.toHaveProperty('__v');
    expect(jsonSession).toHaveProperty('id', session._id.toString());
  });

  test('should correctly apply the paginate plugin', async () => {
    await Session.create([
      {
        sessionName: 'Session 1',
        notaryField: { name: 'Field 1' },
        notaryService: { name: 'Service 1' },
        startTime: '14:00',
        startDate: new Date(),
        endTime: '15:00',
        endDate: new Date(),
        users: [{ email: 'test1@example.com' }],
        createdBy: new mongoose.Types.ObjectId(),
      },
      {
        sessionName: 'Session 2',
        notaryField: { name: 'Field 2' },
        notaryService: { name: 'Service 2' },
        startTime: '14:00',
        startDate: new Date(),
        endTime: '15:00',
        endDate: new Date(),
        users: [{ email: 'test2@example.com' }],
        createdBy: new mongoose.Types.ObjectId(),
      },
      {
        sessionName: 'Session 3',
        notaryField: { name: 'Field 3' },
        notaryService: { name: 'Service 3' },
        startTime: '14:00',
        startDate: new Date(),
        endTime: '15:00',
        endDate: new Date(),
        users: [{ email: 'test3@example.com' }],
        createdBy: new mongoose.Types.ObjectId(),
      },
    ]);

    const result = await Session.paginate({}, { page: 1, limit: 2 });
    expect(result.results).toHaveLength(2);
    expect(result.totalResults).toBe(3);
    expect(result.totalPages).toBe(2);
    expect(result.page).toBe(1);
  });

  test('should throw validation error if required fields are missing', async () => {
    const session = new Session({
      notaryField: { name: 'Field' },
      notaryService: { name: 'Service' },
      startTime: '14:00',
      startDate: new Date(),
      endTime: '15:00',
      endDate: new Date(),
      users: [{ email: 'test@example.com' }],
    });

    let err;
    try {
      await session.validate();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.sessionName).toBeDefined();
  });
});
