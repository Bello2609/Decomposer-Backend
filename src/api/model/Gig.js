const mongoose = require('mongoose');
const { Schema } = mongoose;

const gigSchema = new Schema({
    gigTitle: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    review: {
        type: Schema.Types.ObjectId,
        ref: "Review",
        required: true
    }
})
module.exports = mongoose.model("Gig", gigSchema);