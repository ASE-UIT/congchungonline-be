const httpStatus = require('http-status');
const { locationService } = require('../services');

const getProvinces = async (req, res) => {
  const provinces = await locationService.getProvince();
  res.status(httpStatus.OK).send(provinces);
};

const getDistricts = async (req, res) => {
  const { provinceId } = req.params;
  const districts = await locationService.getDistrict(provinceId);
  res.status(httpStatus.OK).send(districts);
};

const getWards = async (req, res) => {
  const { districtId } = req.params;
  const wards = await locationService.getWard(districtId);
  res.status(httpStatus.OK).send(wards);
};

module.exports = {
  getProvinces,
  getDistricts,
  getWards,
};
