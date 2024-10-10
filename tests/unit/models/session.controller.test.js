/* eslint-disable prettier/prettier */
const httpStatus = require('http-status');
const httpMocks = require('node-mocks-http');
const {
  createSession,
  addUserToSession,
  deleteUserOutOfSession,
  joinSession,
} = require('../../../src/controllers/session.controller');
const { sessionService, emailService } = require('../../../src/services');
const ApiError = require('../../../src/utils/ApiError');

jest.mock('../services/session.service');
jest.mock('../services/email.service');

describe('Session Controller', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('createSession', () => {
    test('should create a session and send invitation emails', async () => {
      const req = httpMocks.createRequest({
        user: { id: 'userId123' },
        body: {
          sessionName: 'Session Name',
          notaryField: 'Field',
          notaryService: 'Service',
          startTime: '2022-01-01T10:00:00Z',
          startDate: '2022-01-01',
          duration: 60,
          email: ['user1@example.com', 'user2@example.com'],
        },
      });
      const res = httpMocks.createResponse();
      res.status = jest.fn(() => res);
      res.send = jest.fn();

      const mockSession = {
        _id: 'sessionId123',
        email: ['user1@example.com', 'user2@example.com'],
      };

      sessionService.validateEmails.mockResolvedValue();
      sessionService.createSession.mockResolvedValue(mockSession);
      emailService.sendInvitationEmail.mockResolvedValue();

      await createSession(req, res);

      expect(sessionService.validateEmails).toHaveBeenCalledWith(req.body.email);
      expect(sessionService.createSession).toHaveBeenCalledWith({
        sessionName: 'Session Name',
        notaryField: 'Field',
        notaryService: 'Service',
        startTime: new Date(req.body.startTime),
        startDate: new Date(req.body.startDate),
        duration: 60,
        email: ['user1@example.com', 'user2@example.com'],
        createdBy: 'userId123',
      });
      expect(emailService.sendInvitationEmail).toHaveBeenCalledTimes(2);
      expect(emailService.sendInvitationEmail).toHaveBeenCalledWith('user1@example.com', 'sessionId123');
      expect(emailService.sendInvitationEmail).toHaveBeenCalledWith('user2@example.com', 'sessionId123');
      expect(res.status).toHaveBeenCalledWith(httpStatus.CREATED);
      expect(res.send).toHaveBeenCalledWith(mockSession);
    });

    test('should handle validation errors', async () => {
      const req = httpMocks.createRequest({
        user: { id: 'userId123' },
        body: {
          email: ['invalid-email'],
        },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      sessionService.validateEmails.mockRejectedValue(new ApiError(httpStatus.BAD_REQUEST, 'Invalid email'));

      await createSession(req, res, next);

      expect(sessionService.validateEmails).toHaveBeenCalledWith(['invalid-email']);
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    });

    test('should handle service errors', async () => {
      const req = httpMocks.createRequest({
        user: { id: 'userId123' },
        body: {
          email: ['user@example.com'],
        },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      sessionService.validateEmails.mockResolvedValue();
      sessionService.createSession.mockRejectedValue(new Error('Service error'));

      await createSession(req, res, next);

      expect(sessionService.createSession).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('addUserToSession', () => {
    test('should add user to session and send invitation email', async () => {
      const req = httpMocks.createRequest({
        user: { id: 'userId123' },
        params: { sessionId: 'sessionId123' },
        body: {
          email: ['newuser@example.com'],
        },
      });
      const res = httpMocks.createResponse();
      res.status = jest.fn(() => res);
      res.send = jest.fn();

      const mockSession = {
        _id: 'sessionId123',
        email: ['user1@example.com', 'newuser@example.com'],
      };

      sessionService.addUserToSession.mockResolvedValue(mockSession);
      emailService.sendInvitationEmail.mockResolvedValue();

      await addUserToSession(req, res);

      expect(sessionService.addUserToSession).toHaveBeenCalledWith({
        sessionId: 'sessionId123',
        email: ['newuser@example.com'],
        userId: 'userId123',
      });
      expect(emailService.sendInvitationEmail).toHaveBeenCalledWith('newuser@example.com', 'sessionId123');
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(mockSession);
    });

    test('should handle service errors', async () => {
      const req = httpMocks.createRequest({
        user: { id: 'userId123' },
        params: { sessionId: 'sessionId123' },
        body: {
          email: ['newuser@example.com'],
        },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      sessionService.addUserToSession.mockRejectedValue(new Error('Service error'));

      await addUserToSession(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('deleteUserOutOfSession', () => {
    test('should delete user from session and send response', async () => {
      const req = httpMocks.createRequest({
        user: { id: 'userId123' },
        params: { sessionId: 'sessionId123' },
        body: {
          email: 'user@example.com',
        },
      });
      const res = httpMocks.createResponse();
      res.status = jest.fn(() => res);
      res.send = jest.fn();

      const mockSession = {
        _id: 'sessionId123',
        email: ['user1@example.com'],
      };

      sessionService.deleteUserOutOfSession.mockResolvedValue(mockSession);

      await deleteUserOutOfSession(req, res);

      expect(sessionService.deleteUserOutOfSession).toHaveBeenCalledWith({
        sessionId: 'sessionId123',
        email: 'user@example.com',
        userId: 'userId123',
      });
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(mockSession);
    });

    test('should handle service errors', async () => {
      const req = httpMocks.createRequest({
        user: { id: 'userId123' },
        params: { sessionId: 'sessionId123' },
        body: {
          email: 'user@example.com',
        },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      sessionService.deleteUserOutOfSession.mockRejectedValue(new Error('Service error'));

      await deleteUserOutOfSession(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('joinSession', () => {
    test('should allow user to join session and send response', async () => {
      const req = httpMocks.createRequest({
        user: { id: 'userId123' },
        params: { sessionId: 'sessionId123' },
        body: {
          require: 'some requirement',
        },
      });
      const res = httpMocks.createResponse();
      res.status = jest.fn(() => res);
      res.send = jest.fn();

      const mockSession = {
        _id: 'sessionId123',
        participants: ['userId123'],
      };

      sessionService.joinSession.mockResolvedValue(mockSession);

      await joinSession(req, res);

      expect(sessionService.joinSession).toHaveBeenCalledWith({
        sessionId: 'sessionId123',
        require: 'some requirement',
        userId: 'userId123',
      });
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(mockSession);
    });

    test('should handle service errors', async () => {
      const req = httpMocks.createRequest({
        user: { id: 'userId123' },
        params: { sessionId: 'sessionId123' },
        body: {
          require: 'some requirement',
        },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      sessionService.joinSession.mockRejectedValue(new Error('Service error'));

      await joinSession(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
