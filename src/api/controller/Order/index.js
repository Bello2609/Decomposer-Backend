const { getLoggedUserId } = require("../../../utils/generalUtils");
const Order = require("../../model/Order");
const orderSchema = require("../../validationSchema/orderSchema");
const statusCodes = require("../../constants/status");

// only a buyer can create order
module.exports.createOrder = (req, res) => {
  let { status, orderPrice, sellerId } = req.body;

  const { error } = orderSchema.validate(
    { orderPrice, sellerId },
    {
      abortEarly: false,
    }
  );

  if (error) {
    return res.status(statusCodes.BAD_REQUEST).json({
      data: {
        message: error.details[0].message,
      },
    });
  }

  let buyerId = getLoggedUserId(req.headers.authorization);
  console.log(buyerId, 'The buyer ID')

  let order = new Order({
    status,
    orderPrice,
    orderBy: {
      sellerId,
      buyerId,
    },
  });

  order.save((error, success) => {
    if (error) {
      return res.status(statusCodes.SERVER_ERROR).json({
        success: false,
        data: {
          message: error,
        },
      });
    }

    return res.status(statusCodes.CREATED).json({
      success: true,
      data: {
        order,
      },
    });
  });
};
