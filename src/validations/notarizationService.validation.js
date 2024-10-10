const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createNotarizationService = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    fieldId: Joi.string().custom(objectId).required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
  }),
};

const updateNotarizationService = {
  params: Joi.object().keys({
    serviceId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().optional(),
      fieldId: Joi.string().custom(objectId).optional(),
      description: Joi.string().optional(),
      price: Joi.number().optional(),
    })
    .min(1),
};

module.exports = {
  createNotarizationService,
  updateNotarizationService,
};
