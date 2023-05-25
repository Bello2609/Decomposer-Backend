const Joi = require("joi");

const jobSchema = Joi.object({
    title: Joi.string().required(),
    category: Joi.string().required(),
    jobType: Joi.string().required(),
    description: Joi.string().required(),
    media: Joi.string().required()
});
module.exports = jobSchema;