const httpStatus = require('http-status');
const httpMocks = require('node-mocks-http');
const ApiError = require('../utils/ApiError');
const firebaseAuth = require('./firebase');
const { app } = require('../config/firebase');

jest.mock('../config/firebase', () => ({
  app: {
    auth: jest.fn(),
  },
}));

describe('Firebase Auth Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = httpMocks.createRequest({
      headers: {
        authorization: 'Bearer validToken',
      },
    });
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should call next() when authentication succeeds', async () => {
    const decodedToken = { uid: 'user123', email: 'user@example.com' };
    app.auth.mockReturnValue({
      verifyIdToken: jest.fn().mockResolvedValue(decodedToken),
    });

    await firebaseAuth(req, res, next);

    expect(app.auth().verifyIdToken).toHaveBeenCalledWith('validToken');
    expect(req.user).toEqual(decodedToken);
    expect(next).toHaveBeenCalled();
  });

  test('should call next() with UNAUTHORIZED error when Authorization header is missing', async () => {
    req.headers.authorization = undefined;

    await firebaseAuth(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(httpStatus.UNAUTHORIZED);
    expect(error.message).toBe('Invalid authentication token');
  });

  test('should call next() with UNAUTHORIZED error when authentication fails', async () => {
    app.auth.mockReturnValue({
      verifyIdToken: jest.fn().mockRejectedValue(new Error('Invalid token')),
    });

    await firebaseAuth(req, res, next);

    expect(app.auth().verifyIdToken).toHaveBeenCalledWith('validToken');
    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(httpStatus.UNAUTHORIZED);
    expect(error.message).toBe('Invalid authentication token');
  });

  test('should call next() with UNAUTHORIZED error when Authorization header is malformed', async () => {
    req.headers.authorization = 'InvalidHeader';

    await firebaseAuth(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(httpStatus.UNAUTHORIZED);
    expect(error.message).toBe('Invalid authentication token');
  });
});
