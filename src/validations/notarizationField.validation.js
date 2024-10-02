const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createNotarizationField = {
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const updateNotarizationField = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
  }),
};

module.exports = {
  createNotarizationField,
  updateNotarizationField,
};
