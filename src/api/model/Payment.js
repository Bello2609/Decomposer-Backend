const mongoose = require("mongoose");

const { Schema } = mongoose;

const paymentSchema = new Schema({
    total_amount: {
        type: String,
        required: true
    },
    cleared: {
        type: String,
        required: true
    },
    pending: {
        type: String,
        required: true
    }

});
 module.exports = mongoose.model("Payment", paymentSchema);