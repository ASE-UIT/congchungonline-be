const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const faker = require('faker');
const { Session } = require('../../../src/models');

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

describe('Session model', () => {
  describe('Session validation', () => {
    let newSession;
    beforeEach(() => {
      newSession = {
        sessionId: faker.datatype.uuid(),
        notaryField: faker.lorem.word(),
        notaryService: faker.lorem.word(),
        sessionName: faker.lorem.words(3),
        startTime: faker.date.future(),
        startDate: faker.date.future(),
        duration: faker.datatype.number({ min: 1, max: 8 }),
        email: [faker.internet.email(), faker.internet.email()],
        createdBy: new mongoose.Types.ObjectId(),
      };
    });

    test('should correctly validate a valid session', async () => {
      await expect(new Session(newSession).validate()).resolves.toBeUndefined();
    });

    test('should throw a validation error if notaryField is missing', async () => {
      newSession.notaryField = undefined;
      await expect(new Session(newSession).validate()).rejects.toThrow();
    });

    test('should throw a validation error if notaryService is missing', async () => {
      newSession.notaryService = undefined;
      await expect(new Session(newSession).validate()).rejects.toThrow();
    });

    test('should throw a validation error if sessionName is missing', async () => {
      newSession.sessionName = undefined;
      await expect(new Session(newSession).validate()).rejects.toThrow();
    });

    test('should throw a validation error if startTime is missing', async () => {
      newSession.startTime = undefined;
      await expect(new Session(newSession).validate()).rejects.toThrow();
    });

    test('should throw a validation error if startDate is missing', async () => {
      newSession.startDate = undefined;
      await expect(new Session(newSession).validate()).rejects.toThrow();
    });

    test('should throw a validation error if duration is missing', async () => {
      newSession.duration = undefined;
      await expect(new Session(newSession).validate()).rejects.toThrow();
    });
  });

  describe('Session toJSON()', () => {
    test('should not return __v when toJSON is called', () => {
      const newSession = {
        sessionId: faker.datatype.uuid(),
        notaryField: faker.lorem.word(),
        notaryService: faker.lorem.word(),
        sessionName: faker.lorem.words(3),
        startTime: faker.date.future(),
        startDate: faker.date.future(),
        duration: faker.datatype.number({ min: 1, max: 8 }),
        email: [faker.internet.email(), faker.internet.email()],
        createdBy: new mongoose.Types.ObjectId(),
      };
      expect(new Session(newSession).toJSON()).not.toHaveProperty('__v');
    });
  });
});