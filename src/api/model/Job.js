const mongoose = require("mongoose");
const { Schema } = mongoose;

const mediaSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    public_id: {
        type: String,
        required: true
    }
})

const jobSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    media: mediaSchema
}, {timestamps: true});
module.exports = mongoose.model("Job", jobSchema);