const Joi = require('joi');

const createSession = {
  body: Joi.object().keys({
    sessionName: Joi.string().required(),
    startDate: Joi.date().required(),
    startTime: Joi.date().required(),
    duration: Joi.number().integer().min(1).required(), 
    email: Joi.array().items(Joi.string().email()).required(),
    createdBy: Joi.string(),
  }),
};

const addUserToSession = {
  params: Joi.object().keys({
    sessionId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    email: Joi.array().items(Joi.string()).required(),
  }),
};

const deleteUserOutOfSession = {
  params: Joi.object().keys({
    sessionId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    email: Joi.array().items(Joi.string()).required(),
  }),
};

module.exports = { 
    createSession, 
    addUserToSession,
    deleteUserOutOfSession,  
};
