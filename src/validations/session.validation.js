const Joi = require('joi');

const createSession = {
  body: Joi.object().keys({
    sessionName: Joi.string().required(),
    startDate: Joi.date().required(),
    startTime: Joi.date().required(),
    duration: Joi.number().integer().min(1).required(), 
    email: Joi.array().items(Joi.string().email()).required(),
    createdBy: Joi.string().hex().length(24).required(),
  }),
};

const addUserToSession = {
    body: Joi.object().keys({
      sessionId: Joi.string().hex().length(24).required(),
      email: Joi.array().items(Joi.string().email()).required(),
    }),
};

const deleteUserOutOfSession = {
    body: Joi.object().keys({
      sessionId: Joi.string().hex().length(24).required(),
      email: Joi.array().items(Joi.string().email()).required(),
    }),
};

module.exports = { 
    createSession, 
    addUserToSession,
    deleteUserOutOfSession,  
};
