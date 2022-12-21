const Joi = require("joi");

const serviceSchema = Joi.object({
  title: Joi.string().required(),
  price: Joi.string().required(),
  duration: Joi.string().required(),
  description: Joi.string().required(),
//   media: Joi.string().required(), // image
});

module.exports = serviceSchema;
