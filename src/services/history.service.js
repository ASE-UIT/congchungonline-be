const httpStatus = require('http-status');
const { History } = require('../models'); // Import History model
const ApiError = require('../utils/ApiError');

/**
 * Get history by UUID
 * @param {string} uuid - UUID of the history
 * @returns {Promise<History>}
 */
const getHistoryByUuid = async (uuid) => {
  try {
    const history = await History.findOne({ uuid });
    if (!history) {
      throw new ApiError(httpStatus.NOT_FOUND, 'History not found');
    }
    return history;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'The error occurred while retrieving the history');
  }
};

module.exports = {
  getHistoryByUuid,
};
