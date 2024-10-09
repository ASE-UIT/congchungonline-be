require('dotenv').config();

const nodemailer = require('nodemailer');
const config = require('../../../src/config/config');
const logger = require('../../../src/config/logger');
const emailService = require('../../../src/services/email.service');

jest.mock('nodemailer');
jest.mock('../../../src/config/logger');

describe('Email Service', () => {
  let transportMock;

  beforeAll(() => {
    transportMock = {
      sendMail: jest.fn(),
      verify: jest.fn().mockResolvedValue(),
    };
    nodemailer.createTransport.mockReturnValue(transportMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendEmail', () => {
    it('should send an email', async () => {
      const to = 'test@example.com';
      const subject = 'Test Subject';
      const text = 'Test Text';

      await emailService.sendEmail(to, subject, text);

      expect(transportMock.sendMail).toHaveBeenCalledWith({
        from: config.email.from,
        to,
        subject,
        text,
      });
    });

    it('should throw an error if sending email fails', async () => {
      const to = 'test@example.com';
      const subject = 'Test Subject';
      const text = 'Test Text';

      transportMock.sendMail.mockRejectedValue(new Error('Send failed'));

      await expect(emailService.sendEmail(to, subject, text)).rejects.toThrow('Send failed');
    });
  });

  describe('sendResetPasswordEmail', () => {
    it('should send a reset password email', async () => {
      const to = 'test@example.com';
      const token = 'test-token';
      const subject = 'Reset password';
      const resetPasswordUrl = `http://localhost:3100/v1/auth/reset-password?token=${token}`;
      const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;

      await emailService.sendResetPasswordEmail(to, token);

      expect(transportMock.sendMail).toHaveBeenCalledWith({
        from: config.email.from,
        to,
        subject,
        text,
      });
    });
  });

  describe('sendVerificationEmail', () => {
    it('should send a verification email', async () => {
      const to = 'test@example.com';
      const token = 'test-token';
      const subject = 'Email Verification';
      const verificationEmailUrl = `http://localhost:3100/v1/auth/verify-email?token=${token}`;
      const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;

      await emailService.sendVerificationEmail(to, token);

      expect(transportMock.sendMail).toHaveBeenCalledWith({
        from: config.email.from,
        to,
        subject,
        text,
      });
    });
  });

  describe('sendInvitationEmail', () => {
    it('should send an invitation email', async () => {
      const to = 'test@example.com';
      const sessionId = 'test-session-id';
      const subject = 'Session Invitation';
      const joinSessionURL = `http://localhost:3100/v1/session/joinSession/${sessionId}`;
      const text = `Dear user,
You are invited to participate in a session
To join the session, click this link: ${joinSessionURL}
If you did not create an account, then ignore this email.`;

      await emailService.sendInvitationEmail(to, sessionId);

      expect(transportMock.sendMail).toHaveBeenCalledWith({
        from: config.email.from,
        to,
        subject,
        text,
      });
    });
  });
});
