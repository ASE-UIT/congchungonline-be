const httpStatus = require('http-status');
const httpMocks = require('node-mocks-http');
const Joi = require('joi');
const validate = require('./validate');
const ApiError = require('../utils/ApiError');

describe('Validation Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  test('should call next() when data is valid', () => {
    const schema = {
      body: Joi.object({
        name: Joi.string().required(),
        age: Joi.number().integer().required(),
      }),
    };

    req = httpMocks.createRequest({
      body: {
        name: 'John Doe',
        age: 30,
      },
    });

    validate(schema)(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.body).toEqual({ name: 'John Doe', age: 30 });
  });

  test('should call next() with BAD_REQUEST error when data is invalid', () => {
    const schema = {
      body: Joi.object({
        name: Joi.string().required(),
        age: Joi.number().integer().required(),
      }),
    };

    req = httpMocks.createRequest({
      body: {
        name: 'John Doe',
        age: 'not a number',
      },
    });

    validate(schema)(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(httpStatus.BAD_REQUEST);
    expect(error.message).toContain('"age" must be a number');
  });

  test('should pick only specified schema parts from req', () => {
    const schema = {
      params: Joi.object({
        id: Joi.string().required(),
      }),
      query: Joi.object({
        search: Joi.string().optional(),
      }),
      body: Joi.object({
        data: Joi.string().required(),
      }),
    };

    req = httpMocks.createRequest({
      params: { id: '123' },
      query: { search: 'test' },
      body: { data: 'some data' },
    });

    validate(schema)(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.params).toEqual({ id: '123' });
    expect(req.query).toEqual({ search: 'test' });
    expect(req.body).toEqual({ data: 'some data' });
  });

  test('should aggregate multiple validation errors into one message', () => {
    const schema = {
      body: Joi.object({
        name: Joi.string().required(),
        age: Joi.number().integer().required(),
      }),
    };

    req = httpMocks.createRequest({
      body: {},
    });

    validate(schema)(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(httpStatus.BAD_REQUEST);
    expect(error.message).toContain('"name" is required');
    expect(error.message).toContain('"age" is required');
  });
});
