// session.service.test.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const httpStatus = require('http-status');
const { Session } = require('../../../src/models');
const ApiError = require('../../../src/utils/ApiError');
const userService = require('../../../src/services/user.service');
const sessionService = require('../../../src/services/session.service');

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

describe('Session Service', () => {
  beforeEach(async () => {
    await Session.deleteMany({});
  });

  describe('validateEmails', () => {
    test('should throw an error if emails is not an array', async () => {
      await expect(sessionService.validateEmails('not-an-array')).rejects.toThrow(ApiError);
    });

    test('should throw an error if any email is invalid', async () => {
      await expect(sessionService.validateEmails(['valid@example.com', 'invalid-email'])).rejects.toThrow(ApiError);
    });

    test('should return true if all emails are valid', async () => {
      await expect(sessionService.validateEmails(['valid@example.com'])).resolves.toBe(true);
    });
  });

  describe('createSession', () => {
    test('should create a session', async () => {
      const sessionBody = {
        sessionName: 'Test Session',
        notaryField: { name: 'Field' },
        notaryService: { name: 'Service' },
        startTime: '14:00',
        startDate: new Date(),
        endTime: '15:00',
        endDate: new Date(),
        users: [{ email: 'test@example.com' }],
        createdBy: new mongoose.Types.ObjectId(),
      };
      const session = await sessionService.createSession(sessionBody);
      expect(session.toObject()).toMatchObject(sessionBody);
    });
  });

  describe('addUserToSession', () => {
    test('should add users to session', async () => {
      const session = await Session.create({
        sessionName: 'Test Session',
        notaryField: { name: 'Field' },
        notaryService: { name: 'Service' },
        startTime: '14:00',
        startDate: new Date(),
        endTime: '15:00',
        endDate: new Date(),
        users: [],
        createdBy: new mongoose.Types.ObjectId(),
      });

      const emails = ['test1@example.com', 'test2@example.com'];
      const updatedSession = await sessionService.addUserToSession(session._id, emails);
      expect(updatedSession.users).toHaveLength(2);
      expect(updatedSession.users.map((user) => user.email)).toEqual(expect.arrayContaining(emails));
    });

    test('should throw an error if user is already added to session', async () => {
      const session = await Session.create({
        sessionName: 'Test Session',
        notaryField: { name: 'Field' },
        notaryService: { name: 'Service' },
        startTime: '14:00',
        startDate: new Date(),
        endTime: '15:00',
        endDate: new Date(),
        users: [{ email: 'test1@example.com' }],
        createdBy: new mongoose.Types.ObjectId(),
      });

      const emails = ['test1@example.com'];
      await expect(sessionService.addUserToSession(session._id, emails)).rejects.toThrow(ApiError);
    });
  });

  describe('deleteUserOutOfSession', () => {
    test('should delete user from session', async () => {
      const session = await Session.create({
        sessionName: 'Test Session',
        notaryField: { name: 'Field' },
        notaryService: { name: 'Service' },
        startTime: '14:00',
        startDate: new Date(),
        endTime: '15:00',
        endDate: new Date(),
        users: [{ email: 'test1@example.com' }],
        createdBy: new mongoose.Types.ObjectId(),
      });

      const updatedSession = await sessionService.deleteUserOutOfSession(
        session._id,
        'test1@example.com',
        session.createdBy
      );
      expect(updatedSession.users).toHaveLength(0);
    });

    test('should throw an error if user is not found in session', async () => {
      const session = await Session.create({
        sessionName: 'Test Session',
        notaryField: { name: 'Field' },
        notaryService: { name: 'Service' },
        startTime: '14:00',
        startDate: new Date(),
        endTime: '15:00',
        endDate: new Date(),
        users: [{ email: 'test1@example.com' }],
        createdBy: new mongoose.Types.ObjectId(),
      });

      await expect(
        sessionService.deleteUserOutOfSession(session._id, 'test2@example.com', session.createdBy)
      ).rejects.toThrow(ApiError);
    });
  });

  describe('joinSession', () => {
    test('should update user status to accepted', async () => {
      const user = { _id: new mongoose.Types.ObjectId(), email: 'test@example.com' };
      jest.spyOn(userService, 'getUserById').mockResolvedValue(user);

      const session = await Session.create({
        sessionName: 'Test Session',
        notaryField: { name: 'Field' },
        notaryService: { name: 'Service' },
        startTime: '14:00',
        startDate: new Date(),
        endTime: '15:00',
        endDate: new Date(),
        users: [{ email: 'test@example.com', status: 'pending' }],
        createdBy: new mongoose.Types.ObjectId(),
      });

      const updatedSession = await sessionService.joinSession(session._id, 'accept', user._id);
      expect(updatedSession.users[0].status).toBe('accepted');
    });

    test('should throw an error if user is not found in session', async () => {
      const user = { _id: new mongoose.Types.ObjectId(), email: 'test@example.com' };
      jest.spyOn(userService, 'getUserById').mockResolvedValue(user);

      const session = await Session.create({
        sessionName: 'Test Session',
        notaryField: { name: 'Field' },
        notaryService: { name: 'Service' },
        startTime: '14:00',
        startDate: new Date(),
        endTime: '15:00',
        endDate: new Date(),
        users: [{ email: 'test1@example.com', status: 'pending' }],
        createdBy: new mongoose.Types.ObjectId(),
      });

      await expect(sessionService.joinSession(session._id, 'accept', user._id)).rejects.toThrow(ApiError);
    });
  });

  describe('getAllSessions', () => {
    test('should return all sessions', async () => {
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

      const sessions = await sessionService.getAllSessions();
      expect(sessions).toHaveLength(1);
      expect(sessions[0].toObject()).toMatchObject(session.toObject());
    });

    test('should throw an error if no sessions are found', async () => {
      await expect(sessionService.getAllSessions()).rejects.toThrow(ApiError);
    });
  });

  describe('getSessionsByDate', () => {
    test('should return sessions for a specific date', async () => {
      const date = new Date();
      const session = await Session.create({
        sessionName: 'Test Session',
        notaryField: { name: 'Field' },
        notaryService: { name: 'Service' },
        startTime: '14:00',
        startDate: date,
        endTime: '15:00',
        endDate: date,
        users: [{ email: 'test@example.com' }],
        createdBy: new mongoose.Types.ObjectId(),
      });

      const sessions = await sessionService.getSessionsByDate(date.toISOString().split('T')[0]);
      expect(sessions).toHaveLength(1);
      expect(sessions[0].toObject()).toMatchObject(session.toObject());
    });

    test('should throw an error if no sessions are found for the specified date', async () => {
      const date = new Date();
      await expect(sessionService.getSessionsByDate(date.toISOString().split('T')[0])).rejects.toThrow(ApiError);
    });
  });

  describe('getSessionsByMonth', () => {
    test('should return sessions for a specific month', async () => {
      const date = new Date();
      const session = await Session.create({
        sessionName: 'Test Session',
        notaryField: { name: 'Field' },
        notaryService: { name: 'Service' },
        startTime: '14:00',
        startDate: date,
        endTime: '15:00',
        endDate: date,
        users: [{ email: 'test@example.com' }],
        createdBy: new mongoose.Types.ObjectId(),
      });

      const sessions = await sessionService.getSessionsByMonth(date.toISOString().split('T')[0].slice(0, 7));
      expect(sessions).toHaveLength(1);
      expect(sessions[0].toObject()).toMatchObject(session.toObject());
    });

    test('should throw an error if no sessions are found for the specified month', async () => {
      const date = new Date();
      await expect(sessionService.getSessionsByMonth(date.toISOString().split('T')[0].slice(0, 7))).rejects.toThrow(
        ApiError
      );
    });
  });

  describe('getActiveSessions', () => {
    test('should return active sessions', async () => {
      const date = new Date();
      const session = await Session.create({
        sessionName: 'Test Session',
        notaryField: { name: 'Field' },
        notaryService: { name: 'Service' },
        startTime: '14:00',
        startDate: date,
        endTime: '15:00',
        endDate: new Date(date.getTime() + 60 * 60 * 1000), // 1 hour later
        users: [{ email: 'test@example.com' }],
        createdBy: new mongoose.Types.ObjectId(),
      });

      const sessions = await sessionService.getActiveSessions();
      expect(sessions).toHaveLength(1);
      expect(sessions[0].toObject()).toMatchObject(session.toObject());
    });

    test('should throw an error if no active sessions are found', async () => {
      await expect(sessionService.getActiveSessions()).rejects.toThrow(ApiError);
    });
  });
});
