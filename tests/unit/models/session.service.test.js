// Thiết lập các biến môi trường cần thiết
process.env.MONGODB_URL = 'mongodb://127.0.0.1:27017/node-boilerplate-test';
process.env.JWT_SECRET = 'thisisasamplesecret';

const httpStatus = require('http-status');
const sessionService = require('../../../src/services/session.service');
const { Session } = require('../../../src/models');
const ApiError = require('../../../src/utils/ApiError');
const validator = require('validator');
const { userService } = require('../../../src/services');
const mongoose = require('mongoose');

// Mock các phương thức của Session model và userService
jest.mock('../../../src/models/session.model', () => {
  const actualSessionModel = jest.requireActual('../../../src/models/session.model');
  return {
    ...actualSessionModel,
    findById: jest.fn(),
    create: jest.fn(),
  };
});
jest.mock('../../../src/services/user.service');
jest.mock('validator');

// Mock Firebase Admin SDK
jest.mock('firebase-admin', () => {
  return {
    initializeApp: jest.fn(),
    credential: {
      cert: jest.fn(),
    },
    database: jest.fn(() => ({
      ref: jest.fn(() => ({
        set: jest.fn(),
        once: jest.fn(),
      })),
    })),
    auth: jest.fn(() => ({
      verifyIdToken: jest.fn(),
    })),
    storage: jest.fn(() => ({
      bucket: jest.fn(() => ({
        upload: jest.fn(),
      })),
    })),
  };
});

describe('Session Service', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/node-boilerplate-test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('validateEmails', () => {
    test('should throw an error if any email is invalid', async () => {
      const emails = ['valid@example.com', 'invalid-email'];
      validator.isEmail.mockImplementation((email) => email === 'valid@example.com');

      await expect(sessionService.validateEmails(emails)).rejects.toThrow(
        new ApiError(httpStatus.BAD_REQUEST, 'Invalid email(s): invalid-email')
      );
    });

    test('should throw an error if any email is not found', async () => {
      const emails = ['valid@example.com', 'notfound@example.com'];
      validator.isEmail.mockReturnValue(true);
      userService.getUserByEmail.mockResolvedValueOnce({ email: 'valid@example.com' }).mockResolvedValueOnce(null);

      await expect(sessionService.validateEmails(emails)).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'Email(s) not found: notfound@example.com')
      );
    });

    test('should pass if all emails are valid and found', async () => {
      const emails = ['valid@example.com'];
      validator.isEmail.mockReturnValue(true);
      userService.getUserByEmail.mockResolvedValue({ email: 'valid@example.com' });

      await expect(sessionService.validateEmails(emails)).resolves.toBeUndefined();
    });
  });

  describe('findBySessionId', () => {
    test('should throw an error if sessionId is invalid', async () => {
      const sessionId = 'invalid-session-id';

      await expect(sessionService.findBySessionId(sessionId)).rejects.toThrow(
        new ApiError(httpStatus.BAD_REQUEST, 'Invalid session ID')
      );
    });

    test('should throw an error if session is not found', async () => {
      const sessionId = new mongoose.Types.ObjectId();

      Session.findById.mockResolvedValue(null);

      await expect(sessionService.findBySessionId(sessionId)).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'Session not found')
      );
    });

    test('should return the session if found', async () => {
      const sessionId = new mongoose.Types.ObjectId();
      const session = { id: sessionId, email: [] };

      Session.findById.mockResolvedValue(session);

      const result = await sessionService.findBySessionId(sessionId);

      expect(Session.findById).toHaveBeenCalledWith(sessionId);
      expect(result).toEqual(session);
    });
  });

  describe('createSession', () => {
    test('should create a new session', async () => {
      const data = { email: ['test@example.com'] };
      const session = { id: new mongoose.Types.ObjectId(), ...data };

      Session.create.mockResolvedValue(session);

      const result = await sessionService.createSession(data);

      expect(Session.create).toHaveBeenCalledWith(data);
      expect(result).toEqual(session);
    });

    test('should throw an error if session creation fails', async () => {
      const data = { email: ['test@example.com'] };

      Session.create.mockRejectedValue(new Error());

      await expect(sessionService.createSession(data)).rejects.toThrow(
        new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to create session')
      );
    });
  });

  describe('addUserToSession', () => {
    test('should add user to session if all conditions are met', async () => {
      const sessionId = new mongoose.Types.ObjectId();
      const email = ['newuser@example.com'];
      const userId = new mongoose.Types.ObjectId();
      const session = { id: sessionId, email: [], save: jest.fn().mockResolvedValue(true) };

      sessionService.findBySessionId = jest.fn().mockResolvedValue(session);
      sessionService.isAuthenticated = jest.fn().mockResolvedValue(true);
      sessionService.validateEmails = jest.fn().mockResolvedValue(true);

      const result = await sessionService.addUserToSession({ sessionId, email, userId });

      expect(sessionService.findBySessionId).toHaveBeenCalledWith(sessionId);
      expect(sessionService.isAuthenticated).toHaveBeenCalledWith(sessionId, userId);
      expect(sessionService.validateEmails).toHaveBeenCalledWith(email);
      expect(session.email).toEqual(email);
      expect(session.save).toHaveBeenCalled();
      expect(result).toEqual(session);
    });

    test('should throw an error if email(s) are already in the session', async () => {
      const sessionId = new mongoose.Types.ObjectId();
      const email = ['existinguser@example.com'];
      const userId = new mongoose.Types.ObjectId();
      const session = { id: sessionId, email: ['existinguser@example.com'], save: jest.fn().mockResolvedValue(true) };

      sessionService.findBySessionId = jest.fn().mockResolvedValue(session);
      sessionService.isAuthenticated = jest.fn().mockResolvedValue(true);
      sessionService.validateEmails = jest.fn().mockResolvedValue(true);

      await expect(sessionService.addUserToSession({ sessionId, email, userId })).rejects.toThrow(
        new ApiError(httpStatus.BAD_REQUEST, 'Email(s) are already in the session')
      );
    });
  });

  describe('deleteUserOutOfSession', () => {
    test('should delete user from session if all conditions are met', async () => {
      const sessionId = new mongoose.Types.ObjectId();
      const email = ['user@example.com'];
      const userId = new mongoose.Types.ObjectId();
      const session = { id: sessionId, email: ['user@example.com'], save: jest.fn().mockResolvedValue(true) };

      sessionService.findBySessionId = jest.fn().mockResolvedValue(session);
      sessionService.isAuthenticated = jest.fn().mockResolvedValue(true);
      sessionService.validateEmails = jest.fn().mockResolvedValue(true);

      const result = await sessionService.deleteUserOutOfSession({ sessionId, email, userId });

      expect(sessionService.findBySessionId).toHaveBeenCalledWith(sessionId);
      expect(sessionService.isAuthenticated).toHaveBeenCalledWith(sessionId, userId);
      expect(sessionService.validateEmails).toHaveBeenCalledWith(email);
      expect(session.email).toEqual([]);
      expect(session.save).toHaveBeenCalled();
      expect(result).toEqual(session);
    });

    test('should throw an error if email(s) not found in the session', async () => {
      const sessionId = new mongoose.Types.ObjectId();
      const email = ['nonexistentuser@example.com'];
      const userId = new mongoose.Types.ObjectId();
      const session = { id: sessionId, email: ['user@example.com'], save: jest.fn().mockResolvedValue(true) };

      sessionService.findBySessionId = jest.fn().mockResolvedValue(session);
      sessionService.isAuthenticated = jest.fn().mockResolvedValue(true);
      sessionService.validateEmails = jest.fn().mockResolvedValue(true);

      await expect(sessionService.deleteUserOutOfSession({ sessionId, email, userId })).rejects.toThrow(
        new ApiError(httpStatus.BAD_REQUEST, 'Email(s) not found in this session')
      );
    });
  });

  describe('joinSession', () => {
    test('should allow user to join session if invited', async () => {
      const sessionId = new mongoose.Types.ObjectId();
      const userId = new mongoose.Types.ObjectId();
      const user = { id: userId, email: 'user@example.com' };
      const session = { id: sessionId, createdBy: new mongoose.Types.ObjectId(), email: ['user@example.com'] };

      sessionService.findBySessionId = jest.fn().mockResolvedValue(session);
      userService.getUserById = jest.fn().mockResolvedValue(user);

      const result = await sessionService.joinSession({ sessionId, require: 'accept', userId });

      expect(sessionService.findBySessionId).toHaveBeenCalledWith(sessionId);
      expect(userService.getUserById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(session);
    });

    test('should throw an error if user is not invited to the session', async () => {
      const sessionId = new mongoose.Types.ObjectId();
      const userId = new mongoose.Types.ObjectId();
      const user = { id: userId, email: 'user@example.com' };
      const session = { id: sessionId, createdBy: new mongoose.Types.ObjectId(), email: [] };

      sessionService.findBySessionId = jest.fn().mockResolvedValue(session);
      userService.getUserById = jest.fn().mockResolvedValue(user);

      await expect(sessionService.joinSession({ sessionId, require: 'accept', userId })).rejects.toThrow(
        new ApiError(httpStatus.FORBIDDEN, 'You are not invited to this session')
      );
    });

    test('should allow user to reject session invitation', async () => {
      const sessionId = new mongoose.Types.ObjectId();
      const userId = new mongoose.Types.ObjectId();
      const user = { id: userId, email: 'user@example.com' };
      const session = { id: sessionId, createdBy: new mongoose.Types.ObjectId(), email: ['user@example.com'] };

      sessionService.findBySessionId = jest.fn().mockResolvedValue(session);
      userService.getUserById = jest.fn().mockResolvedValue(user);

      const result = await sessionService.joinSession({ sessionId, require: 'reject', userId });

      expect(sessionService.findBySessionId).toHaveBeenCalledWith(sessionId);
      expect(userService.getUserById).toHaveBeenCalledWith(userId);
      expect(result).toEqual({ message: 'You have rejected the invitation to join the session' });
    });

    test('should throw an error if user cannot reject the session', async () => {
      const sessionId = new mongoose.Types.ObjectId();
      const userId = new mongoose.Types.ObjectId();
      const user = { id: userId, email: 'user@example.com' };
      const session = { id: sessionId, createdBy: new mongoose.Types.ObjectId(), email: [] };

      sessionService.findBySessionId = jest.fn().mockResolvedValue(session);
      userService.getUserById = jest.fn().mockResolvedValue(user);

      await expect(sessionService.joinSession({ sessionId, require: 'reject', userId })).rejects.toThrow(
        new ApiError(httpStatus.FORBIDDEN, 'You cannot reject the session')
      );
    });
  });

  describe('isAuthenticated', () => {
    test('should return true if user is authenticated', async () => {
      const sessionId = new mongoose.Types.ObjectId();
      const userId = new mongoose.Types.ObjectId();
      const session = { id: sessionId, createdBy: userId };

      sessionService.findBySessionId = jest.fn().mockResolvedValue(session);

      const result = await sessionService.isAuthenticated(sessionId, userId);

      expect(sessionService.findBySessionId).toHaveBeenCalledWith(sessionId);
      expect(result).toBe(true);
    });

    test('should throw an error if user is not authenticated', async () => {
      const sessionId = new mongoose.Types.ObjectId();
      const userId = new mongoose.Types.ObjectId();
      const session = { id: sessionId, createdBy: new mongoose.Types.ObjectId() };

      sessionService.findBySessionId = jest.fn().mockResolvedValue(session);

      await expect(sessionService.isAuthenticated(sessionId, userId)).rejects.toThrow(
        new ApiError(httpStatus.FORBIDDEN, 'Forbidden')
      );
    });
  });
});
