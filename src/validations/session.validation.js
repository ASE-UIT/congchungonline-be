const Joi = require('joi');

const createSession = {
  body: Joi.object().keys({
    sessionName: Joi.string().required(),
    notaryField: Joi.object().required(),
    notaryService: Joi.object().required(),
    startDate: Joi.date().required(),
    startTime: Joi.string()
      .pattern(/^\d{2}:\d{2}$/, { name: 'time' })
      .required(),
    endTime: Joi.string()
      .pattern(/^\d{2}:\d{2}$/, { name: 'time' })
      .required(),
    endDate: Joi.date().required(),
    users: Joi.array()
      .items(
        Joi.object().keys({
          email: Joi.string().email().required(),
        })
      )
      .required(),
    createdBy: Joi.string(),
  }),
};

const addUserToSession = {
  params: Joi.object().keys({
    sessionId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    emails: Joi.array().items(Joi.string()).required(),
  }),
};

const deleteUserOutOfSession = {
  params: Joi.object().keys({
    sessionId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    emails: Joi.array().items(Joi.string().email()).required(),
  }),
};

const joinSession = {
  params: Joi.object().keys({
    sessionId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    action: Joi.string().valid('accept', 'reject').required(),
  }),
};

const getSessionsByDate = {
  query: Joi.object().keys({
    date: Joi.string().required(),
  }),
};

const getSessionsByMonth = {
  query: Joi.object().keys({
    date: Joi.string().required(),
  }),
};

module.exports = {
  createSession,
  addUserToSession,
  deleteUserOutOfSession,
  joinSession,
  getSessionsByDate,
  getSessionsByMonth,
};
