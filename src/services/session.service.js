const httpStatus = require('http-status');
const mongoose = require('mongoose');
const { Session, User } = require('../models');
const ApiError = require('../utils/ApiError');
const { userService } = require('.');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmails = async (emails) => {
  if (!Array.isArray(emails)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Emails must be an array');
  }
  emails.forEach((emailItem) => {
    if (!emailRegex.test(emailItem)) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Invalid email format: ${emailItem}`);
    }
  });
  return true;
};

const isValidFullDate = async (input) => {
  const fullDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const isValidFormat = fullDateRegex.test(input);
  if (!isValidFormat) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid date format');
  }
  const date = new Date(input);
  if (!(date instanceof Date) || Number.isNaN(date)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid date');
  }
  return true;
};

const isValidMonth = async (input) => {
  const monthRegex = /^\d{4}-\d{2}$/;
  const isValidFormat = monthRegex.test(input);
  if (!isValidFormat) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid date format');
  }
  const date = new Date(input);
  if (!(date instanceof Date) || Number.isNaN(date)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid date');
  }
  return true;
};

const findBySessionId = async (sessionId) => {
  const session = await Session.findById(sessionId);
  if (!session) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Session not found');
  }
  return session;
};

const createSession = async (sessionBody) => {
  const session = await Session.create(sessionBody);
  return session;
};

const addUserToSession = async (sessionId, emails) => {
  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid session ID');
  }
  const session = await findBySessionId(sessionId);

  if (!session) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Session not found');
  }

  await validateEmails(emails);
  if (session.users.some((user) => emails.includes(user.email))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already added to this session');
  }
  emails.forEach((email) => {
    session.users.push({ email, status: 'pending' });
  });
  await session.save();
  return session;
};

const deleteUserOutOfSession = async (sessionId, email, userId) => {
  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid session ID');
  }
  const session = await findBySessionId(sessionId);
  if (session.createdBy.toString() !== userId.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to delete users from this session');
  }

  const userIndex = session.users.findIndex((user) => user.email === email);
  if (userIndex !== -1) {
    session.users.splice(userIndex, 1);
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found in session');
  }

  await session.save();
  return session;
};
const joinSession = async (sessionId, action, userId) => {
  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid session ID');
  }
  const session = await Session.findById(sessionId);
  if (!session) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Session not found');
  }
  const user = await userService.getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const userIndex = session.users.findIndex((userItem) => userItem.email === user.email);
  if (userIndex === -1) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found in session');
  }
  if (action === 'accept') {
    session.users[userIndex].status = 'accepted';
  } else if (action === 'reject') {
    session.users[userIndex].status = 'rejected';
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid action');
  }
  await session.save();
  return session;
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
    const sessions = await Session.find({
      endDate: {
        $gte: new Date(),
      },
    });

    if (!sessions || sessions.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No sessions found at present');
    }

    return sessions;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('Error retrieving active sessions:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'An error occurred while retrieving sessions');
  }
};

const getSessionsByUserId = async (userId) => {
  const sessions = await Session.find({ createdBy: userId });
  if (sessions.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sessions not found');
  }
  return sessions;
};

const getSessionBySessionId = async (sessionId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid session ID');
  }
  const session = await Session.findById(sessionId);
  if (!session) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Session not found');
  }
  const user = await User.findById(userId);
  const isSessionCreator = session.createdBy.toString() === userId.toString();
  const isSessionUser = session.users.some((u) => u.email === user.email);
  if (!isSessionCreator && !isSessionUser) {
    throw new ApiError(httpStatus.FORBIDDEN, 'User does not have access to this session');
  }
  return session;
};

module.exports = {
  validateEmails,
  findBySessionId,
  createSession,
  addUserToSession,
  deleteUserOutOfSession,
  joinSession,
  getAllSessions,
  getSessionsByDate,
  getSessionsByMonth,
  getActiveSessions,
  isValidFullDate,
  isValidMonth,
  getSessionsByUserId,
  getSessionBySessionId,
};
