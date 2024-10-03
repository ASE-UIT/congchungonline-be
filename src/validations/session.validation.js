const Joi = require('joi');

const createSession = {
  body: Joi.object().keys({
    sessionName: Joi.string().required(),
    startDate: Joi.date().required(),
    startTime: Joi.date().required(),
    duration: Joi.date().required(),
    // email: Joi.string().required(),
    // createdBy: Joi.string().required(),
  }),
};

module.exports = { 
    createSession,   
};
