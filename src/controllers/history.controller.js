const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { historyService } = require('../services');


// Lấy lịch sử cụ thể theo UUID
const getHistoryByUuid = catchAsync(async (req, res) => {
    const uuid  = req.uuid;  
    const result = await historyService.getHistoryByUuid(uuid);  
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'History not found');
    }
    res.send(result);
});


module.exports = {
    getHistoryByUuid,
}