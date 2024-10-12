const httpStatus = require('http-status');
const validator = require('validator');
const mongoose = require('mongoose');
const { Session } = require('../models');
const ApiError = require('../utils/ApiError');
const { userService, sessionService } = require('.');

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
const createSession = async (sessionBody) => {
  const session = await Session.create(sessionBody);
  return session;
};

// Hàm thêm người dùng vào session
const addUserToSession = async (sessionId, email) => {
  await validateEmails(email);
  const session = await findBySessionId(sessionId);
  const existingUsers = session.users.map((user) => user.email);
  const newUsers = email.filter((emailItem) => !existingUsers.includes(emailItem));
  if (newUsers.length) {
    session.users.push(...newUsers.map((emailItem) => ({ email: emailItem })));
    await session.save();
  }
  return session;
};

// Hàm xóa người dùng khỏi session
const deleteUserOutOfSession = async (sessionId, email, userId) => {
  await validateEmails(email);
  const session = await findBySessionId(sessionId);
  if (session.createdBy.toString() !== userId.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to delete users from this session');
  }
  session.users = session.users.filter((user) => !email.includes(user.email));
  await session.save();
  return session;
};

// Hàm tham gia session
const joinSession = async (sessionId, require, userId) => {
  const session = await findBySessionId(sessionId);
  const user = await userService.getUserById(userId);
  if (session.users.some((userItem) => userItem.email === user.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You are already in this session');
  }
  if (require === 'accept') {
    session.users.push({ email: user.email, status: 'accepted' });
  } else if (require === 'reject') {
    session.users.push({ email: user.email, status: 'rejected' });
  }
  await session.save();
  return session;
};

// Hàm lấy tất cả session
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

// Hàm lấy session theo ngày
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

// Hàm lấy session theo tháng
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

// Hàm lấy session đang hoạt động
const getActiveSessions = async () => {
  try {
    const now = new Date();
    const present = new Date(now.getTime() + 7 * 60 * 60 * 1000); // Adjust to the desired time zone

    const sessions = await Session.find({
      $and: [
        {
          startDate: { $lte: present },
        },
        {
          $expr: {
            $gte: [
              {
                $add: [
                  '$endDate',
                  {
                    $multiply: [
                      {
                        $toInt: { $substr: ['$endTime', 0, 2] }, // Extract hours from "15:00"
                      },
                      60 * 60 * 1000,
                    ],
                  },
                  {
                    $multiply: [
                      {
                        $toInt: { $substr: ['$endTime', 3, 2] }, // Extract minutes from "15:00"
                      },
                      60 * 1000,
                    ],
                  },
                ],
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
    console.error('Error retrieving active sessions:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'An error occurred while retrieving sessions');
  }
};

// Hàm kiểm tra định dạng ngày
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

// Hàm kiểm tra định dạng tháng
const isValidMonth = async (input) => {
  const monthRegex = /^\d{4}-\d{2}$/;
  const isValidFormat = monthRegex.test(input);
  if (!isValidFormat) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid date format');
  }
  const date = new Date(input);
  if (!(date instanceof Date) || isNaN(date)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid date');
  }
  return true;
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
};
