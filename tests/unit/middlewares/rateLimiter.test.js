const httpMocks = require('node-mocks-http');
const { authLimiter } = require('./rateLimiter');
const rateLimit = require('express-rate-limit');

jest.mock('express-rate-limit');

describe('Rate Limiter Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should configure rate limiter with correct options', () => {
    expect(rateLimit).toHaveBeenCalledWith({
      windowMs: 15 * 60 * 1000,
      max: 20,
      skipSuccessfulRequests: true,
    });
  });

  test('should allow requests under the limit', () => {
    const mockRateLimiter = jest.fn((req, res, next) => next());
    rateLimit.mockReturnValue(mockRateLimiter);

    authLimiter(req, res, next);

    expect(mockRateLimiter).toHaveBeenCalledWith(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('should block requests over the limit', () => {
    const error = new Error('Too many requests');
    const mockRateLimiter = jest.fn((req, res, next) => next(error));
    rateLimit.mockReturnValue(mockRateLimiter);

    authLimiter(req, res, next);

    expect(mockRateLimiter).toHaveBeenCalledWith(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });
});
