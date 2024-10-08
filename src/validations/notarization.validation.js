const Joi = require('joi');

const createDocument = {
  body: Joi.object().keys({
    files: Joi.object().keys({}),
    notaryService: Joi.string().required(),
    notaryField: Joi.string().required(),
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
