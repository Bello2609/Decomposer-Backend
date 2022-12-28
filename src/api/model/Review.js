const mongoose = require("mongoose");
const { Schema } = mongoose;
const reviewSchema = new Schema({
    buyerName: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    description: {
        type: String,
        required: true
    },
   
}, {timestamps: true})
module.exports = mongoose.model("Review", reviewSchema);