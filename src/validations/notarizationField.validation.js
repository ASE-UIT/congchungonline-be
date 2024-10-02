const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createNotarizationField = {
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const getNotarizationField = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const getAllNotarizationFields = {
  query: Joi.object().keys({
    sortBy: Joi.string().optional(),
    limit: Joi.number().integer().optional(),
    page: Joi.number().integer().optional(),
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

const deleteNotarizationField = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createNotarizationField,
  getNotarizationField,
  getAllNotarizationFields,
  updateNotarizationField,
  deleteNotarizationField,
};
