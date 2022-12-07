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
        type: Schema.Types.ObjectId,
        ref: "Service",
        required: false
    },
    profile_image: {
        type: String,
        required: false
    },
    header_image: {
        type: String,
        required: false
    },
    amount: {
        type: Schema.Types.ObjectId,
        ref: "Amount",
        required: false
    },
    isVerified: {
        type: Boolean,
        required: true
    },
    userToken: String,
    userTokenExpiration: Date

})
module.exports = mongoose.model("User", userSchema);
