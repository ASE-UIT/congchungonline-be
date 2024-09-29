const Joi = require('joi');

const createRole = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    permissions: Joi.array().items(Joi.string()).required(),
  }),
};

const updateRole = {
  body: Joi.object().keys({
    name: Joi.string(),
    permissions: Joi.array().items(Joi.string()),
  }),
};

module.exports = { createRole, updateRole };
