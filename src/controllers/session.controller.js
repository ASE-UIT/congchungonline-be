const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { sessionService } = require('../services');

// Hàm kiểm tra giá trị có phải là ngày hợp lệ hay không
const isValidDate = (date) => {
  return !isNaN(new Date(date).getTime());
};

// Hàm tạo phiên công chứng
const createSession = catchAsync(async (req, res) => {
  const { sessionName, startTime, startDate, duration } = req.body;

//   // Kiểm tra nếu requesterInfo là chuỗi, thì parse thành object
//   if (typeof requesterInfo === 'string') {
//     req.body.requesterInfo = JSON.parse(requesterInfo);
//   }

//   // Kiểm tra tính hợp lệ của startTime và startDate
//   if (!isValidDate(startTime) || !isValidDate(startDate)) {
//     return res.status(httpStatus.BAD_REQUEST).send({ message: 'Thời gian hoặc ngày bắt đầu không hợp lệ' });
//   }

  // Tạo session công chứng
  const session = await sessionService.createSession({
    sessionName,
    startTime: new Date(startTime),
    startDate: new Date(startDate),
    duration,
  });
  
  res.status(httpStatus.CREATED).send(session);
});

module.exports = {
  createSession,
};
