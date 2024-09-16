const Joi = require('joi');

const chatbot = {
  body: Joi.object().keys({
    prompt: Joi.string().required(),
  }),
};

module.exports = {
  chatbot,
};
