const httpStatus = require('http-status');
const { Session } = require('../models');
const ApiError = require('../utils/ApiError');
const validator = require('validator');
const { userService, sessionService } = require('./');
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

// Hàm tham gia session
const joinSession = async ({ sessionId, require, userId }) => {
  const session = await findBySessionId(sessionId);
  const user = await userService.getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (require === 'accept') {
    if (session.createdBy !== userId && !session.email.includes(user.email)) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You are not invited to this session');
    }
    return session;
  } else if (require === 'reject') {
    console.log('userId:', userId, 'sessionUserId:', session.createdBy);
    if (session.createdBy !== userId && !session.email.includes(user.email)) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You cannot reject the session');
    }
    return { message: 'You have rejected the invitation to join the session' };
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid request type. It must be either "accept" or "reject".');
  }
};

// Hàm kiểm tra authenticate
const isAuthenticated = async (sessionId, userId) => {
  const session = await findBySessionId(sessionId);
  if (session.createdBy.toString() !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  return true;
};

const getAllSessions = async () => {
  try {
    const sessions = await Session.find();
    if (sessions.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No sessions found');
    }
    return sessions;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'An error occurred while retrieving sessions');
  }
};

const getSessionsByDate = async (date) => {
  try {
    if (!date) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Date is required');
    }
    await isValidFullDate(date);
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);
    const sessions = await Session.find({
      startDate: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    if (!sessions || sessions.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No sessions found for the specified date');
    }

    return sessions;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'An error occurred while retrieving sessions');
  }
};

const getSessionsByMonth = async (date) => {
  try {
    if (!date) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Date is required');
    }
    await isValidMonth(date);
    const givenDate = new Date(date);
    const startOfMonth = new Date(givenDate.getFullYear(), givenDate.getMonth(), 1, 0, 0, 0, 0);
    const endOfMonth = new Date(givenDate.getFullYear(), givenDate.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);
    console.log('startofmonth: ', startOfMonth, 'endofmonth: ', endOfMonth);
    const sessions = await Session.find({
      startDate: {
        $gte: startOfMonth,
        $lt: endOfMonth,
      },
    });
    if (!sessions || sessions.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No sessions found for the specified month');
    }
    return sessions;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'An error occurred while retrieving sessions');
  }
};

const getActiveSessions = async () => {
  try {
    const now = new Date();
    const present = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    console.log('present: ',present);
    const sessions = await Session.find({
      $and: [
        {
          startDate: { $lte: present },
        },
        {
          $expr: {
            $gte: [
              {
                $add: ['$startDate', { $multiply: ['$duration', 60 * 1000] }],
              },
              present,
            ],
          },
        },
      ],
    });

    if (!sessions || sessions.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No sessions found at present');
    }

    return sessions;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.log(error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'An error occurred while retrieving sessions');
  }
};

const isValidFullDate = async (input) => {
  const fullDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const isValidFormat = fullDateRegex.test(input);
  if (!isValidFormat) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid date format');
  }
  const date = new Date(input);
  if (!(date instanceof Date) || isNaN(date)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid date');
  }
  return true;
};

const isValidMonth = async (input) => {
  const fullDateRegex = /^\d{4}-\d{2}$/;
  const isValidFormat = fullDateRegex.test(input);
  if (!isValidFormat) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid date format');
  }
  const date = new Date(input);
  if (!(date instanceof Date) || isNaN(date)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid month');
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
  joinSession,
  getAllSessions,
  getSessionsByDate,
  getSessionsByMonth,
  getActiveSessions,
  isValidFullDate,
  isValidMonth,
};
