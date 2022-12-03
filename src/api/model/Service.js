const mongoose = require("mongoose");

const { Schema } = mongoose;

const serviceSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    media: {
        type: String,
        required: true
    }
})
module.exports = mongoose.model("Services", serviceSchema);