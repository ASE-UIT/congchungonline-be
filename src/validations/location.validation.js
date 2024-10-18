const Joi = require('joi');

const getDistrict = {
  params: Joi.object().keys({
    provinceId: Joi.string().required(),
  }),
};

const getWard = {
  params: Joi.object().keys({
    districtId: Joi.string().required(),
  }),
};

module.exports = {
  getDistrict,
  getWard,
};
