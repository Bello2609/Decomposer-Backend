const Joi = require("joi");

const orderSchema = Joi.object({
  // status: Joi.string().required(),
  orderPrice: Joi.string().required(),
  sellerId: Joi.string().required(),
});

module.exports = orderSchema;
