const mongoose = require("mongoose");
const { Schema } = mongoose;
const reviewSchema = new Schema({
    buyerName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt: Date.now()
})
module.exports = mongoose.model("Review", reviewSchema);