// // email.service.test.js
// const nodemailer = require('nodemailer');
// const config = require('../../../src/config/config');
// const logger = require('../../../src/config/logger');
// const emailService = require('../../../src/services/email.service'); // Adjust the path as necessary

// // Mock the dependencies
// jest.mock('nodemailer');
// jest.mock('../../../src/config/config');
// jest.mock('../../../src/config/logger');

// describe('Email Service', () => {
//   let transportMock;

//   beforeAll(() => {
//     // Mock the transport object
//     transportMock = {
//       sendMail: jest.fn().mockResolvedValue(true),
//       verify: jest.fn().mockResolvedValue(true),
//     };
//     nodemailer.createTransport.mockReturnValue(transportMock);

//     // Mock the config object
//     config.email = {
//       smtp: {},
//       from: 'test@example.com',
//     };
//     config.env = 'development';
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   test('sendEmail should call transport.sendMail with correct parameters', async () => {
//     const to = 'user@example.com';
//     const subject = 'Test Subject';
//     const text = 'Test Text';

//     await emailService.sendEmail(to, subject, text);

//     expect(transportMock.sendMail).toHaveBeenCalledWith({
//       from: config.email.from,
//       to,
//       subject,
//       text,
//     });
//   });

//   test('sendResetPasswordEmail should call sendEmail with correct parameters', async () => {
//     const to = 'user@example.com';
//     const token = 'test-token';
//     const expectedText = `Dear user,
// To reset your password, click on this link: http://localhost:3100/v1/auth/reset-password?token=${token}
// If you did not request any password resets, then ignore this email.`;

//     await emailService.sendResetPasswordEmail(to, token);

//     expect(transportMock.sendMail).toHaveBeenCalledWith({
//       from: config.email.from,
//       to,
//       subject: 'Reset password',
//       text: expectedText,
//     });
//   });

//   test('sendVerificationEmail should call sendEmail with correct parameters', async () => {
//     const to = 'user@example.com';
//     const token = 'test-token';
//     const expectedText = `Dear user,
// To verify your email, click on this link: http://localhost:3100/v1/auth/verify-email?token=${token}
// If you did not create an account, then ignore this email.`;

//     await emailService.sendVerificationEmail(to, token);

//     expect(transportMock.sendMail).toHaveBeenCalledWith({
//       from: config.email.from,
//       to,
//       subject: 'Email Verification',
//       text: expectedText,
//     });
//   });

//   test('sendInvitationEmail should call sendEmail with correct parameters', async () => {
//     const to = 'user@example.com';
//     const sessionId = 'test-session-id';
//     const expectedText = `Dear user,
// You are invited to participate in a session
// To join the session, click this link: http://localhost:3100/v1/session/joinSession/${sessionId}
// If you did not create an account, then ignore this email.`;

//     await emailService.sendInvitationEmail(to, sessionId);

//     expect(transportMock.sendMail).toHaveBeenCalledWith({
//       from: config.email.from,
//       to,
//       subject: 'Session Invitation',
//       text: expectedText,
//     });
//   });
// });
