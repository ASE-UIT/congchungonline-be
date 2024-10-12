const setupTestDB = require('../../utils/setupTestDB');
const httpStatus = require('http-status');
const tokenService = require('../../../src/services/token.service');
const userService = require('../../../src/services/user.service');
const Token = require('../../../src/models/token.model');
const { Document } = require('../../../src/models');
const ApiError = require('../../../src/utils/ApiError');
const { tokenTypes } = require('../../../src/config/tokens');
const authService = require('../../../src/services/auth.service');

setupTestDB();
jest.mock('../../../src/services/token.service');
jest.mock('../../../src/services/user.service');
jest.mock('../../../src/models/token.model');
jest.mock('../../../src/models/document.model');

describe('Auth Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loginUserWithEmailAndPassword', () => {
    it('should return user if email and password match', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const user = { email, isPasswordMatch: jest.fn().mockResolvedValue(true) };

      userService.getUserByEmail.mockResolvedValue(user);

      const result = await authService.loginUserWithEmailAndPassword(email, password);

      expect(userService.getUserByEmail).toHaveBeenCalledWith(email);
      expect(user.isPasswordMatch).toHaveBeenCalledWith(password);
      expect(result).toEqual(user);
    });

    it('should throw an error if email or password is incorrect', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      userService.getUserByEmail.mockResolvedValue(null);

      await expect(authService.loginUserWithEmailAndPassword(email, password)).rejects.toThrow(
        new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password')
      );
    });
  });

  describe('logout', () => {
    it('should remove refresh token', async () => {
      const refreshToken = 'test-refresh-token';
      const refreshTokenDoc = { token: refreshToken, remove: jest.fn().mockResolvedValue() };

      Token.findOne.mockResolvedValue(refreshTokenDoc);

      await authService.logout(refreshToken);

      expect(Token.findOne).toHaveBeenCalledWith({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
      expect(refreshTokenDoc.remove).toHaveBeenCalled();
    });

    it('should throw an error if refresh token is not found', async () => {
      const refreshToken = 'test-refresh-token';

      Token.findOne.mockResolvedValue(null);

      await expect(authService.logout(refreshToken)).rejects.toThrow(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
    });
  });

  describe('refreshAuth', () => {
    it('should return new auth tokens if refresh token is valid', async () => {
      const refreshToken = 'test-refresh-token';
      const userId = 'test-user-id';
      const user = { id: userId };
      const refreshTokenDoc = { user: userId, remove: jest.fn().mockResolvedValue() };
      const tokens = { access: 'new-access-token', refresh: 'new-refresh-token' };

      tokenService.verifyToken.mockResolvedValue(refreshTokenDoc);
      userService.getUserById.mockResolvedValue(user);
      tokenService.generateAuthTokens.mockResolvedValue(tokens);

      const result = await authService.refreshAuth(refreshToken);

      expect(tokenService.verifyToken).toHaveBeenCalledWith(refreshToken, tokenTypes.REFRESH);
      expect(userService.getUserById).toHaveBeenCalledWith(userId);
      expect(refreshTokenDoc.remove).toHaveBeenCalled();
      expect(tokenService.generateAuthTokens).toHaveBeenCalledWith(user);
      expect(result).toEqual(tokens);
    });

    it('should throw an error if refresh token is invalid', async () => {
      const refreshToken = 'test-refresh-token';

      tokenService.verifyToken.mockRejectedValue(new Error());

      await expect(authService.refreshAuth(refreshToken)).rejects.toThrow(
        new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate')
      );
    });
  });

  describe('resetPassword', () => {
    it('should reset password if reset token is valid', async () => {
      const resetPasswordToken = 'test-reset-token';
      const newPassword = 'newPassword123';
      const userId = 'test-user-id';
      const user = { id: userId };

      tokenService.verifyToken.mockResolvedValue({ user: userId });
      userService.getUserById.mockResolvedValue(user);
      userService.updateUserById.mockResolvedValue();
      Token.deleteMany.mockResolvedValue();

      await authService.resetPassword(resetPasswordToken, newPassword);

      expect(tokenService.verifyToken).toHaveBeenCalledWith(resetPasswordToken, tokenTypes.RESET_PASSWORD);
      expect(userService.getUserById).toHaveBeenCalledWith(userId);
      expect(userService.updateUserById).toHaveBeenCalledWith(userId, { password: newPassword });
      expect(Token.deleteMany).toHaveBeenCalledWith({ user: userId, type: tokenTypes.RESET_PASSWORD });
    });

    it('should throw an error if reset token is invalid', async () => {
      const resetPasswordToken = 'test-reset-token';
      const newPassword = 'newPassword123';

      tokenService.verifyToken.mockRejectedValue(new Error());

      await expect(authService.resetPassword(resetPasswordToken, newPassword)).rejects.toThrow(
        new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed')
      );
    });
  });

  describe('verifyEmail', () => {
    it('should verify email if verify token is valid', async () => {
      const verifyEmailToken = 'test-verify-token';
      const userId = 'test-user-id';
      const user = { id: userId };

      tokenService.verifyToken.mockResolvedValue({ user: userId });
      userService.getUserById.mockResolvedValue(user);
      Token.deleteMany.mockResolvedValue();
      userService.updateUserById.mockResolvedValue();

      await authService.verifyEmail(verifyEmailToken);

      expect(tokenService.verifyToken).toHaveBeenCalledWith(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
      expect(userService.getUserById).toHaveBeenCalledWith(userId);
      expect(Token.deleteMany).toHaveBeenCalledWith({ user: userId, type: tokenTypes.VERIFY_EMAIL });
      expect(userService.updateUserById).toHaveBeenCalledWith(userId, { isEmailVerified: true });
    });

    it('should throw an error if verify token is invalid', async () => {
      const verifyEmailToken = 'test-verify-token';

      tokenService.verifyToken.mockRejectedValue(new Error());

      await expect(authService.verifyEmail(verifyEmailToken)).rejects.toThrow(
        new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed')
      );
    });
  });

  describe('getHistoryByUuid', () => {
    it('should return history by user ID', async () => {
      const userId = 'test-user-id';
      const history = { userId, documents: [] };

      Document.findOne.mockResolvedValue(history);

      const result = await authService.getHistoryByUuid(userId);

      expect(Document.findOne).toHaveBeenCalledWith({ userId });
      expect(result).toEqual(history);
    });

    it('should throw an error if history is not found', async () => {
      const userId = 'test-user-id';

      Document.findOne.mockResolvedValue(null);

      await expect(authService.getHistoryByUuid(userId)).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'History not found')
      );
    });

    it('should throw an error if fetching history fails', async () => {
      const userId = 'test-user-id';

      Document.findOne.mockRejectedValue(new Error());

      await expect(authService.getHistoryByUuid(userId)).rejects.toThrow(
        new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'The error occurred while retrieving the history')
      );
    });
  });
});
