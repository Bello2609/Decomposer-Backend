const mongoose = require("mongoose");
const { Schema }  = mongoose;


const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    services: {
        type: String,
        required: true
    },
    profile_image: {
        type: String,
        required: true
    },
    header_image: {
        type: String,
        required: true
    },
    amount: {
        type: Schema.Type.ObjectId,
        ref: "Amount"
        required: true
    },
    isVerified: {
        type: Boolean,
        required: true
    }


})
module.exports = mongoose.model("User", userSchema);
