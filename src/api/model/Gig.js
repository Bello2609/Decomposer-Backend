const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
    buyerName: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
   
}, {timestamps: true})


const gigSchema = new Schema({
    gigTitle: {
        type: String,
        required: false
    },
    price: {
        type: String,
        required: false
    },
    review: [reviewSchema],
    ratings: {
        type: Number,
        required: false,
        default: 0
    },
    numReview: {
        type: Number,
        required: false,
        default: 0
    }
}, {timestamps: true})
module.exports = mongoose.model("Gig", gigSchema);