const Joi = require('joi');

const createDocument = {
  body: Joi.object().keys({
    files: Joi.object().keys({}),
    notaryService: Joi.string().required(),
    notaryField: Joi.string().required(),
    requesterInfo: Joi.string().required(),
  }),
};

module.exports = { createDocument };
