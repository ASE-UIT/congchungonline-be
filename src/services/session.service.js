const httpStatus = require('http-status');
const { Session } = require('../models');
const ApiError = require('../utils/ApiError');
const validator = require('validator'); // Thêm thư viện validator
const catchAsync = require('../utils/catchAsync');
const { userService } = require('./'); 
const mongoose = require('mongoose');

// Hàm kiểm tra email 
const validateEmails = async (email) => {
  const invalidEmails = [];
  const notFoundEmails = [];

  for (const emailItem of email) {
    if (!validator.isEmail(emailItem)) {
      invalidEmails.push(emailItem);
    } else {
      const user = await userService.getUserByEmail(emailItem);
      if (!user) {
        notFoundEmails.push(emailItem);
      } 
    }
  }
  
  if (invalidEmails.length > 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Invalid email(s): ${invalidEmails.join(', ')}`);
  }
  if (notFoundEmails.length > 0) {
    throw new ApiError(httpStatus.NOT_FOUND, `Email(s) not found: ${notFoundEmails.join(', ')}`);
  }
};


// Hàm tạo session
const createSession = async (Data) => {
  try {
    const session = await Session.create({
      sessionName: Data.sessionName,
      startTime: Data.startTime,
      startDate: Data.startDate,
      duration: Data.duration,
      email: Data.email, 
      createdBy: Data.createdBy,
    });

    return session;
  } catch (error) {
    console.error('Error creating session:', error.message);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to create session');
  }
};

// Hàm thêm người dùng vào session
const addUserToSession = async (Data) => {
  try {
    const session = await Session.findById(Data.sessionId);
    const existingEmails = session.email || []; 
    const newEmails = Data.email.filter(emailItem => !existingEmails.includes(emailItem)); 

    if (newEmails.length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email(s) are already in the session');
    }
    session.email = [...existingEmails, ...newEmails];
    await session.save();
    return session;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
};

// Hàm tìm session id
const findBySessionId = async (sessionId) => {
  try {
    const isValidObjectId = (sessionId) => mongoose.Types.ObjectId.isValid(sessionId);
    if (!isValidObjectId(sessionId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid session ID');
    }
    const session = await Session.findById(sessionId);
    if (!session) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Session not found');
    }
    return session;
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, error.message);
  }
};

// Hàm xóa người dùng ra khỏi session
const deleteUserOutOfSession = async (Data) => {
  try {
    const session = await Session.findById(Data.sessionId);
    const existingEmails = session.email || []; 
    const newEmails = Data.email.filter(emailItem => !existingEmails.includes(emailItem)); 

    if (newEmails.length > 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email(s) not found in this session');
    }
    session.email = existingEmails.filter(emailItem => !Data.email.includes(emailItem));
    await session.save();
    return session;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
};


module.exports = {
  validateEmails,
  createSession,
  addUserToSession,
  findBySessionId,
  deleteUserOutOfSession,
};
