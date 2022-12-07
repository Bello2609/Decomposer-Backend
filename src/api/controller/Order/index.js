const { getLoggedUserId } = require("../../../utils/generalUtils");
const Order = require("../../model/Order");
const orderSchema = require("../../validationSchema/orderSchema");
const statusCodes = require("../../constants/status");
const mongoose = require("mongoose");

// only a buyer can create order
module.exports.createOrder = async (req, res) => {
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

  let buyerId = await getLoggedUserId(req.headers.authorization);

  let order = new Order({
    status,
    orderPrice,
    orderBy: {
      sellerId: mongoose.Types.ObjectId(sellerId),
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
