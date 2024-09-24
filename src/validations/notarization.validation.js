const Joi = require('joi');

const documentSchema = Joi.object({
    files: Joi.array().items(
        Joi.object({
            filename: Joi.string().required().trim(),
            firebaseUrl: Joi.string().required().trim(),
        })
    ).required(),
    notaryService: Joi.string().required(),
    notaryField: Joi.string().required(),
    requesterInfo: Joi.object({
        citizenId: Joi.string()
            .required()
            .length(12)
            .pattern(/^\d+$/)
            .messages({
                'string.length': 'CCCD phải có đúng 12 số',
                'string.pattern.base': 'CCCD chỉ được chứa số',
            }),
        phoneNumber: Joi.string()
            .required()
            .pattern(/^\d{10,15}$/)
            .messages({
                'string.pattern.base': 'Vui lòng nhập số điện thoại hợp lệ',
            }),
        email: Joi.string()
            .required()
            .email()
            .messages({
                'string.email': 'Vui lòng nhập địa chỉ email hợp lệ',
            }),
    }).required(),
    createdAt: Joi.date().default(Date.now)
});

module.exports = documentSchema;
