const { getLoggedUserId } = require("../../../utils/generalUtils");
const Order = require("../../model/Order");
const orderSchema = require("../../validationSchema/orderSchema");
const statusCodes = require("../../constants/status");
const statusMessages = require("../../constants/messages");
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

// get buyers orrdes
module.exports.myOrders = async (req, res) => {
  let buyerId = await getLoggedUserId(req.headers.authorization);
  Order.find({
    "orderBy.buyerId": buyerId,
  })
    .then((result) => {
      if (!result || result.length === 0) {
        return res.status(statusCodes.NOT_FOUND).json({
          success: false,
          data: {
            message: "No order found",
          },
        });
      }

      return res.status(statusCodes.OK).json({
        success: true,
        data: { orders: result },
      });
    })
    .catch((err) => {
      return res.status(statusCodes.SERVER_ERROR).json({
        success: false,
        data: {
          message: err,
        },
      });
    });
};

module.exports.oneOrder = (req, res) => {
  Order.findById(req.params.id).exec((err, order) => {
    if (err) {
      return res.status(statusCodes.SERVER_ERROR).json({
        success: false,
        data: {
          message: err,
        },
      });
    }

    if (!order) {
      return res.status(statusCodes.NOT_FOUND).json({
        success: false,
        data: {
          message: "No order found",
        },
      });
    }

    return res.status(statusCodes.OK).json({
      success: true,
      data: {
        order,
      },
    });
  });
};

// owner of order can only update
module.exports.updateOrder = (req, res) => {
  let { status, orderPrice } = req.body;
  if (Object.keys(req.body).length === 0) {
    return res.status(statusCodes.BAD_REQUEST).json({
      success: false,
      data: {
        message: statusMessages.BAD_REQUEST,
      },
    });
  }
  Order.findById(req.params.id)
    .then(async (order) => {
      if (!order) {
        return res.status(statusCodes.NOT_FOUND).json({
          success: false,
          data: {
            message: "Order not found",
          },
        });
      }

      // check if the order is owned by current user
      else {
        let loggedUserId = await getLoggedUserId(req.headers.authorization);
        if (String(loggedUserId) === String(order.orderBy.buyerId)) {
          order.status = status ? status : order.status;
          order.orderPrice = orderPrice ? orderPrice : order.orderPrice;
          //save
          order.save((err, updatedOrder) => {
            if (err) {
              return res.status(statusCodes.SERVER_ERROR).json({
                success: false,
                data: {
                  message: err,
                },
              });
            }
            return res.status(statusCodes.OK).json({
              success: true,
              data: {
                order: updatedOrder,
              },
            });
          });
        } else {
          return res.status(statusCodes.FORBIDDEN).json({
            success: false,
            data: {
              message: statusMessages.FORBIDDEN,
            },
          });
        }
      }
    })
    .catch((err) => {
      return res.status(statusCodes.SERVER_ERROR).json({
        success: false,
        data: {
          message: err,
        },
      });
    });
};

module.exports.deleteOrder = (req, res) => {
  Order.findById(req.params.id)
    .then(async (order) => {
      if (!order) {
        return res.status(statusCodes.NOT_FOUND).json({
          success: false,
          data: {
            message: "Order not found",
          },
        });
      }

      let loggedUserId = await getLoggedUserId(req.headers.authorization);

      if (String(loggedUserId) === String(order.orderBy.buyerId)) {
        order.remove((err, deletedOrder) => {
          if (err) {
            return res.status(statusCodes.SERVER_ERROR).json({
              success: false,
              data: {
                message: err,
              },
            });
          }

          return res.status(statusCodes.OK).json({
            success: true,
            data: {
              message: "Order deleted successfully",
            },
          });
        });
      } else {
        return res.status(statusCodes.FORBIDDEN).json({
          success: false,
          data: {
            message: statusMessages.FORBIDDEN,
          },
        });
      }
    })
    .catch((err) => {
      return res.status(statusCodes.SERVER_ERROR).json({
        success: false,
        data: {
          message: err,
        },
      });
    });
};
