const httpStatus = require('http-status');
const { Session } = require('../models');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

// Hàm tạo session
const createSession = async (Data) => {
  try {
    // Tạo một session mới với dữ liệu truyền vào
    const session = await Session.create({
      sessionName: Data.sessionName,
      startTime: Data.startTime,
      startDate: Data.startDate,
      duration: Data.duration,
    //   createdBy: Data.createdBy, // ID của người tạo phiên
    //   email: sessionData.email, // Email từ requesterInfo
    });

    return session;
  } catch (error) {
    console.error('Error creating session:', error.message);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to create session');
  }
};


module.exports = {
  createSession,
};
