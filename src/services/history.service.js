// const httpStatus = require('http-status');
const { History } = require('../models'); // Import History model
// const ApiError = require('../utils/ApiError');

/**
 * Get history by UUID
 * @param {string} uuid - UUID of the history
 * @returns {Promise<History>}
 */
const getHistoryByUuid = async (uuid) => {
  const history = await History.findOne({ uuid });
  return history;
};

module.exports = {
  getHistoryByUuid,
};
