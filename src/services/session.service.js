const httpStatus = require('http-status');
const { Session } = require('../models');
const ApiError = require('../utils/ApiError');
const validator = require('validator');
const { userService } = require('./');
const mongoose = require('mongoose');

// Hàm kiểm tra email
const validateEmails = async (email) => {
  const invalidEmails = email.filter((emailItem) => !validator.isEmail(emailItem));
  if (invalidEmails.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Invalid email(s): ${invalidEmails.join(', ')}`);
  }
  const notFoundEmails = [];
  for (const emailItem of email) {
    if (!(await userService.getUserByEmail(emailItem))) {
      notFoundEmails.push(emailItem);
    }
  }
  if (notFoundEmails.length) {
    throw new ApiError(httpStatus.NOT_FOUND, `Email(s) not found: ${notFoundEmails.join(', ')}`);
  }
};

// Hàm tìm session id
const findBySessionId = async (sessionId) => {
  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid session ID');
  }
  const session = await Session.findById(sessionId);
  if (!session) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Session not found');
  }
  return session;
};

// Hàm tạo session
const createSession = async (data) => {
  try {
    return await Session.create(data);
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to create session');
  }
};

// Hàm thêm người dùng vào session
const addUserToSession = async ({ sessionId, email, userId }) => {
  const session = await findBySessionId(sessionId);
  await isAuthenticated(sessionId, userId);
  await validateEmails(email);
  const existingEmails = session.email || [];
  const newEmails = email.filter((emailItem) => !existingEmails.includes(emailItem));
  if (!newEmails.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email(s) are already in the session');
  }
  session.email = [...existingEmails, ...newEmails];
  await session.save();
  return session;
};

// Hàm xóa người dùng ra khỏi session
const deleteUserOutOfSession = async ({ sessionId, email, userId }) => {
  const session = await findBySessionId(sessionId);
  await isAuthenticated(sessionId, userId);
  await validateEmails(email);
  const existingEmails = session.email || [];
  const emailsToDelete = email.filter((emailItem) => existingEmails.includes(emailItem));
  if (!emailsToDelete.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email(s) not found in this session');
  }

  session.email = existingEmails.filter((emailItem) => !emailsToDelete.includes(emailItem));
  await session.save();
  return session;
};

// Hàm kiểm tra authenticate
const isAuthenticated = async (sessionId, userId) => {
  const session = await findBySessionId(sessionId);
  if (session.createdBy.toString() !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  return true;
};

module.exports = {
  validateEmails,
  createSession,
  addUserToSession,
  findBySessionId,
  deleteUserOutOfSession,
  isAuthenticated,
};
