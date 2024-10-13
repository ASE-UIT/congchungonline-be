require('dotenv').config();

const mockFirebase = require('./firebase.mock');
mockFirebase();

const request = require('supertest');
const express = require('express');
const httpStatus = require('http-status');
const { userService } = require('../../../src/services');
const userController = require('../../../src/controllers/user.controller');
const catchAsync = require('../../../src/utils/catchAsync');
const ApiError = require('../../../src/utils/ApiError');

jest.mock('../../../src/services/user.service');
jest.mock('../../../src/utils/catchAsync', () => (fn) => (req, res, next) => fn(req, res, next).catch(next));

const app = express();
app.use(express.json());
app.post('/users', userController.createUser);
app.get('/users', userController.getUsers);
app.get('/users/:userId', userController.getUser);
app.put('/users/:userId', userController.updateUser);
app.delete('/users/:userId', userController.deleteUser);

describe('User Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const userBody = { name: 'John Doe', email: 'john@example.com', password: 'password123' };
      const user = { id: 'user-id', ...userBody };

      userService.createUser.mockResolvedValue(user);

      const res = await request(app).post('/users').send(userBody);

      expect(res.status).toBe(httpStatus.CREATED);
      expect(res.body).toEqual(user);
      expect(userService.createUser).toHaveBeenCalledWith(userBody);
    });
  });

  describe('GET /users', () => {
    it('should return a list of users', async () => {
      const users = [{ id: 'user-id', name: 'John Doe', email: 'john@example.com' }];
      const query = { name: 'John', role: 'user', sortBy: 'name:asc', limit: 10, page: 1 };

      userService.queryUsers.mockResolvedValue(users);

      const res = await request(app).get('/users').query(query);

      expect(res.status).toBe(httpStatus.OK);
      expect(res.body).toEqual(users);
      expect(userService.queryUsers).toHaveBeenCalledWith(
        { name: 'John', role: 'user' },
        { sortBy: 'name:asc', limit: 10, page: 1 }
      );
    });
  });

  describe('GET /users/:userId', () => {
    it('should return a user by ID', async () => {
      const userId = 'user-id';
      const user = { id: userId, name: 'John Doe', email: 'john@example.com' };

      userService.getUserById.mockResolvedValue(user);

      const res = await request(app).get(`/users/${userId}`).send();

      expect(res.status).toBe(httpStatus.OK);
      expect(res.body).toEqual(user);
      expect(userService.getUserById).toHaveBeenCalledWith(userId);
    });

    it('should return 404 if user not found', async () => {
      const userId = 'user-id';

      userService.getUserById.mockResolvedValue(null);

      const res = await request(app).get(`/users/${userId}`).send();

      expect(res.status).toBe(httpStatus.NOT_FOUND);
      expect(res.body).toEqual({ code: httpStatus.NOT_FOUND, message: 'User not found' });
    });
  });

  describe('PUT /users/:userId', () => {
    it('should update a user by ID', async () => {
      const userId = 'user-id';
      const updateBody = { name: 'John Updated' };
      const user = { id: userId, name: 'John Updated', email: 'john@example.com' };

      userService.updateUserById.mockResolvedValue(user);

      const res = await request(app).put(`/users/${userId}`).send(updateBody);

      expect(res.status).toBe(httpStatus.OK);
      expect(res.body).toEqual(user);
      expect(userService.updateUserById).toHaveBeenCalledWith(userId, updateBody);
    });
  });

  describe('DELETE /users/:userId', () => {
    it('should delete a user by ID', async () => {
      const userId = 'user-id';

      userService.deleteUserById.mockResolvedValue();

      const res = await request(app).delete(`/users/${userId}`).send();

      expect(res.status).toBe(httpStatus.NO_CONTENT);
      expect(userService.deleteUserById).toHaveBeenCalledWith(userId);
    });
  });
});
