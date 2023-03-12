const Joi = require("joi");

const joiReviewSchema =
    Joi.object({
        title: Joi.string().required(),
        name: Joi.string().required(),
        body: Joi.string().required(),
        date: Joi.string(),
        rating: Joi.number().required()
    })

module.exports = joiReviewSchema;