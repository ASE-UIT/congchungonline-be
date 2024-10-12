require('dotenv').config();

const jwt = require('jsonwebtoken');
const moment = require('moment');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const userService = require('../../../src/services/user.service');
const tokenService = require('../../../src/services/token.service');
const Token = require('../../../src/models/token.model');
const ApiError = require('../../../src/utils/ApiError');
const { tokenTypes } = require('../../../src/config/tokens');
const setupTestDB = require('../../utils/setupTestDB');

// Mock các phương thức của jwt và userService
jest.mock('jsonwebtoken');
jest.mock('../../../src/services/user.service');

setupTestDB();

describe('Token Service', () => {
  describe('generateToken', () => {
    test('should return a JWT token', () => {
      const userId = new mongoose.Types.ObjectId();
      const expires = moment().add(1, 'days');
      const type = tokenTypes.ACCESS;
      const secret = process.env.JWT_SECRET;

      jwt.sign.mockReturnValue('fake-jwt-token');

      const token = tokenService.generateToken(userId, expires, type, secret);

      expect(jwt.sign).toHaveBeenCalledWith(
        {
          sub: userId,
          iat: expect.any(Number),
          exp: expires.unix(),
          type,
        },
        secret
      );
      expect(token).toBe('fake-jwt-token');
    });
  });

  describe('saveToken', () => {
    test('should save a token and return the token doc', async () => {
      const token = 'fake-jwt-token';
      const userId = new mongoose.Types.ObjectId();
      const expires = moment().add(1, 'days');
      const type = tokenTypes.ACCESS;
      const blacklisted = false;

      const tokenDoc = { token, user: userId, expires: expires.toDate(), type, blacklisted };
      jest.spyOn(Token, 'create').mockResolvedValue(tokenDoc);

      const savedToken = await tokenService.saveToken(token, userId, expires, type, blacklisted);

      expect(Token.create).toHaveBeenCalledWith({
        token,
        user: userId,
        expires: expires.toDate(),
        type,
        blacklisted,
      });
      expect(savedToken).toEqual(tokenDoc);
    });
  });

  describe('verifyToken', () => {
    test('should return the token doc if token is valid', async () => {
      const token = 'fake-jwt-token';
      const userId = new mongoose.Types.ObjectId();
      const type = tokenTypes.ACCESS;

      jwt.verify.mockReturnValue({ sub: userId });
      const tokenDoc = { token, user: userId, type, blacklisted: false };
      jest.spyOn(Token, 'findOne').mockResolvedValue(tokenDoc);

      const verifiedToken = await tokenService.verifyToken(token, type);

      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
      expect(Token.findOne).toHaveBeenCalledWith({ token, type, user: userId, blacklisted: false });
      expect(verifiedToken).toEqual(tokenDoc);
    });

    test('should throw an error if token is not found', async () => {
      const token = 'fake-jwt-token';
      const type = tokenTypes.ACCESS;

      jwt.verify.mockReturnValue({ sub: new mongoose.Types.ObjectId() });
      jest.spyOn(Token, 'findOne').mockResolvedValue(null);

      await expect(tokenService.verifyToken(token, type)).rejects.toThrow('Token not found');
    });
  });

  describe('generateAuthTokens', () => {
    test('should return access and refresh tokens', async () => {
      const userId = new mongoose.Types.ObjectId();
      const user = { id: userId };

      jwt.sign.mockReturnValueOnce('fake-access-token').mockReturnValueOnce('fake-refresh-token');
      jest.spyOn(Token, 'create').mockResolvedValue({ token: 'fake-refresh-token', user: userId });

      const tokens = await tokenService.generateAuthTokens(user);

      expect(tokens).toEqual({
        access: {
          token: 'fake-access-token',
          expires: expect.any(Date),
        },
        refresh: {
          token: 'fake-refresh-token',
          expires: expect.any(Date),
        },
      });
      expect(Token.create).toHaveBeenCalledWith({
        token: 'fake-refresh-token',
        user: userId,
        expires: expect.any(Date),
        type: tokenTypes.REFRESH,
        blacklisted: false,
      });
    });
  });

  describe('generateResetPasswordToken', () => {
    test('should return reset password token', async () => {
      const email = 'test@example.com';
      const userId = new mongoose.Types.ObjectId();
      const user = { id: userId, email };

      userService.getUserByEmail.mockResolvedValue(user);
      jwt.sign.mockReturnValue('fake-reset-password-token');
      jest.spyOn(Token, 'create').mockResolvedValue({ token: 'fake-reset-password-token', user: userId });

      const resetPasswordToken = await tokenService.generateResetPasswordToken(email);

      expect(resetPasswordToken).toBe('fake-reset-password-token');
      expect(userService.getUserByEmail).toHaveBeenCalledWith(email);
      expect(Token.create).toHaveBeenCalledWith({
        token: 'fake-reset-password-token',
        user: userId,
        expires: expect.any(Date),
        type: tokenTypes.RESET_PASSWORD,
        blacklisted: false,
      });
    });

    test('should throw an error if user is not found', async () => {
      const email = 'test@example.com';

      userService.getUserByEmail.mockResolvedValue(null);

      await expect(tokenService.generateResetPasswordToken(email)).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'No users found with this email')
      );
    });
  });

  describe('generateVerifyEmailToken', () => {
    test('should return verify email token', async () => {
      const userId = new mongoose.Types.ObjectId();
      const user = { id: userId };

      jwt.sign.mockReturnValue('fake-verify-email-token');
      jest.spyOn(Token, 'create').mockResolvedValue({ token: 'fake-verify-email-token', user: userId });

      const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);

      expect(verifyEmailToken).toBe('fake-verify-email-token');
      expect(Token.create).toHaveBeenCalledWith({
        token: 'fake-verify-email-token',
        user: userId,
        expires: expect.any(Date),
        type: tokenTypes.VERIFY_EMAIL,
        blacklisted: false,
      });
    });
  });
});
