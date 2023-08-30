const Joi = require('joi')

const validators = {

    register: Joi.object({
        firstName: Joi.string().min(3).max(100).required(),
        email: Joi.string().min(3).max(30).required(),
        password: Joi.string().required(),
        portfolio: Joi.array().items(Joi.string()),
    }),

    loginSchema: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
    }),
}

module.exports = validators