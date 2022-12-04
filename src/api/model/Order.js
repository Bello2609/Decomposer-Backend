const mongoose = require("mongoose");

const { Schema } = mongoose;
const orderSchema = new Schema({
    sellerName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    orderPrice: {
        type: Number,
        required: true
    },
    orderBy: {
        buyerName: {
            type: String,
            required: true
        }
    },
    createdAt: Date.now()
});
module.exports =  mongoose.model("Order", orderSchema);