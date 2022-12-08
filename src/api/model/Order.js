const mongoose = require("mongoose");

const { Schema } = mongoose;

const orderStatus = {
  pending: "pending",
  completed: "completed",
};

const orderPartySchema = new Schema({
  sellerId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  buyerId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});
// {
//   sellerName: {
//     type: String,
//     required: true,
//   },
//   status: {
//     type: String,
//     required: true,
//   },
//   orderPrice: {
//     type: Number,
//     required: true,
//   },
//   orderBy: {
//     buyerName: {
//       type: String,
//       required: true,
//     },
//   },
// },

const orderSchema = new Schema(
  {
    status: {
      type: String,
      enum: Object.values(orderStatus),
      default: orderStatus.pending,
      required: true,
    },
    orderPrice: {
      type: Number,
      required: true,
    },
    orderBy: orderPartySchema,
  },
  { timestamps: true }
);
module.exports = mongoose.model("Order", orderSchema);
