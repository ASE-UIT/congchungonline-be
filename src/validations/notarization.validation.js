const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createDocument = {
  body: Joi.object().keys({
    files: Joi.object().keys({}),
    notarizationServiceId: Joi.string().custom(objectId),
    notarizationFieldId: Joi.string().custom(objectId),
    requesterInfo: Joi.string().required(),
  }),
};

const getHistoryByUserId = {
  headers: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};

const forwardDocumentStatus = {
  headers: Joi.object().keys({
    userId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    action: Joi.string().required(),
  }),
};

module.exports = { createDocument, getHistoryByUserId, forwardDocumentStatus };
