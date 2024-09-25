const Joi = require('joi');

const getHistoryByUuid = {
    headers: Joi.object().keys({
        'x-request-id': Joi.string().required(),
    }),
};

module.exports = {
    getHistoryByUuid,
};
