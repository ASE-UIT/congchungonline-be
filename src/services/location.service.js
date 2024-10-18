const axios = require('axios');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const hostURL = 'https://vapi.vnappmob.com/api';

const headers = {
  'Content-Type': 'application/json',
};

const getProvince = async () => {
  try {
    const response = await axios.get(`${hostURL}/province`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error getting provinces:', error.message);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to get provinces');
  }
};

const getDistrict = async (provinceId) => {
  try {
    if (typeof provinceId !== 'string' || !/^\d+$/.test(provinceId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid province ID format');
    }

    const response = await axios.get(`${hostURL}/province/district/${provinceId}`, { headers, timeout: 2000 });
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      // Xử lý lỗi timeout riêng
      throw new ApiError(httpStatus.REQUEST_TIMEOUT, 'Request timed out');
    }

    if (error instanceof ApiError) {
      throw error;
    }

    console.error('Error getting districts:', error.message);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to get districts');
  }
};

const getWard = async (districtId) => {
  try {
    if (typeof districtId !== 'string' || !/^\d+$/.test(districtId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid district ID format');
    }
    const response = await axios.get(`${hostURL}/province/ward/${districtId}`, { headers, timeout: 1000 });

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('Error getting wards:', error.message);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to get wards');
  }
};

module.exports = {
  getProvince,
  getDistrict,
  getWard,
};
