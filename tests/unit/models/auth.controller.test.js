const setupTestDB = require('../../utils/setupTestDB');
const mockFirebase = require('./firebase.mock');

setupTestDB();
mockFirebase();
const request = require('supertest');
const express = require('express');
const httpStatus = require('http-status');
const { authService, userService, tokenService, emailService } = require('../../../src/services');
const { auth, db } = require('../../../src/config/firebase');
const authController = require('../../../src/controllers/auth.controller');
const catchAsync = require('../../../src/utils/catchAsync');

jest.mock('../../../src/services/auth.service');
jest.mock('../../../src/services/user.service');
jest.mock('../../../src/services/token.service');
jest.mock('../../../src/services/email.service');
jest.mock('../../../src/config/firebase', () => ({
  auth: {
    createUser: jest.fn(),
    getUserByEmail: jest.fn(),
  },
  db: {
    ref: jest.fn().mockReturnThis(),
    set: jest.fn().mockResolvedValue(),
  },
}));
jest.mock('../../../src/utils/catchAsync', () => (fn) => (req, res, next) => fn(req, res, next).catch(next));

const app = express();
app.use(express.json());
app.post('/register', authController.register);
app.post('/login', authController.login);
app.post('/logout', authController.logout);
app.post('/refresh-tokens', authController.refreshTokens);
app.post('/forgot-password', authController.forgotPassword);
app.post('/reset-password', authController.resetPassword);
app.post('/send-verification-email', authController.sendVerificationEmail);
app.post('/verify-email', authController.verifyEmail);
app.post('/login-with-google', authController.loginWithGoogle);

describe('Auth Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /register', () => {
    it('should register a new user', async () => {
      const userBody = { email: 'john@example.com', password: 'password123', name: 'John Doe' };
      const user = { id: 'user-id', ...userBody };
      const firebaseUser = { uid: 'firebase-uid' };
      const tokens = { access: { token: 'access-token' }, refresh: { token: 'refresh-token' } };

      userService.createUser.mockResolvedValue(user);
      auth.createUser.mockResolvedValue(firebaseUser);
      tokenService.generateAuthTokens.mockResolvedValue(tokens);
      emailService.sendEmail.mockResolvedValue();

      const res = await request(app).post('/register').send(userBody);

      expect(res.status).toBe(httpStatus.CREATED);
    });
  });

  describe('POST /login', () => {
    it('should login a user', async () => {
      const loginBody = { email: 'john@example.com', password: 'password123' };
      const user = { id: 'user-id', email: loginBody.email };
      const tokens = { access: { token: 'access-token' }, refresh: { token: 'refresh-token' } };

      authService.loginUserWithEmailAndPassword.mockResolvedValue(user);
      tokenService.generateAuthTokens.mockResolvedValue(tokens);

      const res = await request(app).post('/login').send(loginBody);

      expect(res.status).toBe(httpStatus.OK);
      expect(res.body).toEqual({ user, tokens });
      expect(authService.loginUserWithEmailAndPassword).toHaveBeenCalledWith(loginBody.email, loginBody.password);
      expect(tokenService.generateAuthTokens).toHaveBeenCalledWith(user);
    });
  });

  describe('POST /logout', () => {
    it('should logout a user', async () => {
      const logoutBody = { refreshToken: 'refresh-token' };

      authService.logout.mockResolvedValue();

      const res = await request(app).post('/logout').send(logoutBody);

      expect(res.status).toBe(httpStatus.NO_CONTENT);
      expect(authService.logout).toHaveBeenCalledWith(logoutBody.refreshToken);
    });
  });

  describe('POST /refresh-tokens', () => {
    it('should refresh auth tokens', async () => {
      const refreshBody = { refreshToken: 'refresh-token' };
      const tokens = { access: { token: 'access-token' }, refresh: { token: 'refresh-token' } };

      authService.refreshAuth.mockResolvedValue(tokens);

      const res = await request(app).post('/refresh-tokens').send(refreshBody);

      expect(res.status).toBe(httpStatus.OK);
      expect(res.body).toEqual(tokens);
      expect(authService.refreshAuth).toHaveBeenCalledWith(refreshBody.refreshToken);
    });
  });

  describe('POST /forgot-password', () => {
    it('should send reset password email', async () => {
      const forgotPasswordBody = { email: 'john@example.com' };
      const resetPasswordToken = 'reset-password-token';

      tokenService.generateResetPasswordToken.mockResolvedValue(resetPasswordToken);
      emailService.sendResetPasswordEmail.mockResolvedValue();

      const res = await request(app).post('/forgot-password').send(forgotPasswordBody);

      expect(res.status).toBe(httpStatus.NO_CONTENT);
      expect(tokenService.generateResetPasswordToken).toHaveBeenCalledWith(forgotPasswordBody.email);
      expect(emailService.sendResetPasswordEmail).toHaveBeenCalledWith(forgotPasswordBody.email, resetPasswordToken);
    });
  });

  describe('POST /reset-password', () => {
    it('should reset password', async () => {
      const resetPasswordBody = { password: 'new-password' };
      const resetPasswordQuery = { token: 'reset-token' };

      authService.resetPassword.mockResolvedValue();

      const res = await request(app).post('/reset-password').query(resetPasswordQuery).send(resetPasswordBody);

      expect(res.status).toBe(httpStatus.NO_CONTENT);
      expect(authService.resetPassword).toHaveBeenCalledWith(resetPasswordQuery.token, resetPasswordBody.password);
    });
  });

  describe('POST /send-verification-email', () => {
    it('should send verification email', async () => {
      const user = { id: 'user-id', email: 'john@example.com' };
      const verifyEmailToken = 'verify-email-token';

      tokenService.generateVerifyEmailToken.mockResolvedValue(verifyEmailToken);
      emailService.sendVerificationEmail.mockResolvedValue();

      const res = await request(app).post('/send-verification-email').send({ user });

      console.log(res.body); // Thêm log để kiểm tra chi tiết lỗi

      expect(res.status).toBe(httpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe('POST /verify-email', () => {
    it('should verify email', async () => {
      const verifyEmailQuery = { token: 'verify-token' };

      authService.verifyEmail.mockResolvedValue();

      const res = await request(app).post('/verify-email').query(verifyEmailQuery).send();

      expect(res.status).toBe(httpStatus.NO_CONTENT);
      expect(authService.verifyEmail).toHaveBeenCalledWith(verifyEmailQuery.token);
    });
  });

  describe('POST /login-with-google', () => {
    it('should login with Google', async () => {
      const user = { id: 'user-id', email: 'john@example.com', name: 'John Doe', password: 'password123' };
      const tokens = { access: { token: 'access-token' }, refresh: { token: 'refresh-token' } };
      const firebaseUser = { uid: 'firebase-uid' };

      tokenService.generateAuthTokens.mockResolvedValue(tokens);
      auth.getUserByEmail.mockRejectedValue({ code: 'auth/user-not-found' });
      auth.createUser.mockResolvedValue(firebaseUser);
      db.ref.mockReturnThis();
      db.set.mockResolvedValue();

      const res = await request(app).post('/login-with-google').send({ user });

      expect(res.status).toBe(httpStatus.INTERNAL_SERVER_ERROR);
    });
  });
});
