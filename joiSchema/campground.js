const Joi = require("joi");

const joiCampSchema = Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(3).max(1000),
    description: Joi.string().required(),
    // image: Joi.string().required(),
    location: Joi.string().required(),
    photoCamp: Joi.string()
})

module.exports = joiCampSchema;