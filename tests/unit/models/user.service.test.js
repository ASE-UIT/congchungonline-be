const mongoose = require('mongoose');
const faker = require('faker');
const { User } = require('../../../src/models');
const httpStatus = require('http-status');
const ApiError = require('../../../src/utils/ApiError');
const userService = require('../../../src/services/user.service');

jest.mock('../../../src/models/user.model');

describe('User Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    test('should throw an error if email is already taken', async () => {
      User.isEmailTaken.mockResolvedValue(true);

      const userBody = { email: 'test@example.com', password: 'password123' };

      await expect(userService.createUser(userBody)).rejects.toThrow(
        new ApiError(httpStatus.BAD_REQUEST, 'Email already taken')
      );
    });

    test('should create a new user if email is not taken', async () => {
      User.isEmailTaken.mockResolvedValue(false);
      User.create.mockResolvedValue({ id: 'userId', email: 'test@example.com' });

      const userBody = { email: 'test@example.com', password: 'password123' };

      const result = await userService.createUser(userBody);

      expect(User.isEmailTaken).toHaveBeenCalledWith(userBody.email);
      expect(User.create).toHaveBeenCalledWith(userBody);
      expect(result).toEqual({ id: 'userId', email: 'test@example.com' });
    });
  });

  describe('queryUsers', () => {
    test('should return paginated users', async () => {
      const filter = {};
      const options = { limit: 10, page: 1 };
      const paginatedUsers = { docs: [], totalDocs: 0, limit: 10, page: 1, totalPages: 1 };

      User.paginate.mockResolvedValue(paginatedUsers);

      const result = await userService.queryUsers(filter, options);

      expect(User.paginate).toHaveBeenCalledWith(filter, options);
      expect(result).toEqual(paginatedUsers);
    });
  });

  describe('getUserById', () => {
    test('should return user if found', async () => {
      const userId = 'userId';
      const user = { id: userId, email: 'test@example.com' };

      User.findById.mockResolvedValue(user);

      const result = await userService.getUserById(userId);

      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(user);
    });

    test('should return null if user not found', async () => {
      const userId = 'userId';

      User.findById.mockResolvedValue(null);

      const result = await userService.getUserById(userId);

      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(result).toBeNull();
    });
  });

  describe('getUserByEmail', () => {
    test('should return user if found', async () => {
      const email = 'test@example.com';
      const user = { id: 'userId', email };

      User.findOne.mockResolvedValue(user);

      const result = await userService.getUserByEmail(email);

      expect(User.findOne).toHaveBeenCalledWith({ email });
      expect(result).toEqual(user);
    });

    test('should throw an error if user not found', async () => {
      const email = 'test@example.com';

      User.findOne.mockResolvedValue(null);
      const result = await userService.getUserByEmail(email);
      expect(result).toBeNull();
    });
  });

  describe('updateUserById', () => {
    test('should throw an error if user not found', async () => {
      const userId = 'userId';
      const updateBody = { email: 'new@example.com' };

      User.findById.mockResolvedValue(null);

      await expect(userService.updateUserById(userId, updateBody)).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'User not found')
      );
    });

    test('should throw an error if email is already taken', async () => {
      const userId = 'userId';
      const updateBody = { email: 'new@example.com' };
      const user = { id: userId, email: 'test@example.com' };

      User.findById.mockResolvedValue(user);
      User.isEmailTaken.mockResolvedValue(true);

      await expect(userService.updateUserById(userId, updateBody)).rejects.toThrow(
        new ApiError(httpStatus.BAD_REQUEST, 'Email already taken')
      );
    });

    test('should update and return user if data is valid', async () => {
      const userId = 'userId';
      const updateBody = { email: 'new@example.com' };
      const user = { id: userId, email: 'test@example.com', save: jest.fn().mockResolvedValue(true) };

      User.findById.mockResolvedValue(user);
      User.isEmailTaken.mockResolvedValue(false);

      const result = await userService.updateUserById(userId, updateBody);

      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(User.isEmailTaken).toHaveBeenCalledWith(updateBody.email, userId);
      expect(user.save).toHaveBeenCalled();
      expect(result).toEqual(user);
    });
  });

  describe('deleteUserById', () => {
    test('should throw an error if user not found', async () => {
      const userId = 'userId';

      User.findById.mockResolvedValue(null);

      await expect(userService.deleteUserById(userId)).rejects.toThrow(new ApiError(httpStatus.NOT_FOUND, 'User not found'));
    });

    test('should delete and return user if found', async () => {
      const userId = 'userId';
      const user = { id: userId, email: 'test@example.com', remove: jest.fn().mockResolvedValue(true) };

      User.findById.mockResolvedValue(user);

      const result = await userService.deleteUserById(userId);

      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(user.remove).toHaveBeenCalled();
      expect(result).toEqual(user);
    });
  });
});
