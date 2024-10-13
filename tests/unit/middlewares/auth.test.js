const httpStatus = require('http-status');
const httpMocks = require('node-mocks-http');
const passport = require('passport');
const ApiError = require('../../../src/utils/ApiError');
const auth = require('../../../src/middlewares/auth');
const rolesConfig = require('../../../src/config/roles');

jest.mock('passport');

describe('Auth middleware', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should call next() if authentication succeeds and user has required rights', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    const user = { id: 'userId123', role: 'user' };
    passport.authenticate.mockImplementation((strategy, options, callback) => () => {
      callback(null, user, null);
    });
    const requiredRights = ['uploadDocuments'];
    await auth(...requiredRights)(req, res, next);

    expect(req.user).toEqual(user);
    expect(next).toHaveBeenCalled();
  });

  test('should call next with UNAUTHORIZED error if authentication fails', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    passport.authenticate.mockImplementation((strategy, options, callback) => () => {
      callback(null, false, null);
    });

    await auth()(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(httpStatus.UNAUTHORIZED);
    expect(error.message).toBe('Please authenticate');
  });

  test('should call next with FORBIDDEN error if user lacks required rights', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    const user = { id: 'userId123', role: 'user' };

    passport.authenticate.mockImplementation((strategy, options, callback) => () => {
      callback(null, user, null);
    });

    const requiredRights = ['manageUsers'];

    await auth(...requiredRights)(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(httpStatus.FORBIDDEN);
    expect(error.message).toBe('Forbidden');
  });

  test('should call next with INTERNAL_SERVER_ERROR if getPermissionsByRoleName throws an error', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    const user = { id: 'userId123', role: 'user' };

    passport.authenticate.mockImplementation((strategy, options, callback) => {
      return () => {
        callback(null, user, null);
      };
    });

    jest.spyOn(rolesConfig, 'getPermissionsByRoleName').mockRejectedValue(new Error('Database error'));

    const requiredRights = ['uploadDocuments'];

    await auth(...requiredRights)(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(httpStatus.INTERNAL_SERVER_ERROR);
    expect(error.message).toBe('Error fetching role permissions');
  });

  test('should call next() if user is accessing their own data', async () => {
    const req = httpMocks.createRequest({
      params: { userId: 'userId123' },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    const user = { id: 'userId123', role: 'user' };

    passport.authenticate.mockImplementation((strategy, options, callback) => () => {
      callback(null, user, null);
    });

    const requiredRights = ['manageUsers'];

    await auth(...requiredRights)(req, res, next);

    expect(req.user).toEqual(user);
    expect(next).toHaveBeenCalled();
  });

  test("should call next with FORBIDDEN error if user lacks required rights and is accessing someone else's data", async () => {
    const req = httpMocks.createRequest({
      params: { userId: 'otherUserId' },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    const user = { id: 'userId123', role: 'user' };

    passport.authenticate.mockImplementation((strategy, options, callback) => () => {
      callback(null, user, null);
    });

    const requiredRights = ['manageUsers'];

    await auth(...requiredRights)(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(httpStatus.FORBIDDEN);
    expect(error.message).toBe('Forbidden');
  });
});
