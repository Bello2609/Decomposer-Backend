const mongoose = require("mongoose");

const { Schema } = mongoose;

const mediaSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    required: true,
    select: false,
  },
});

const serviceSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    media: mediaSchema,
  },
  { timestamps: true }
);
module.exports = mongoose.model("Services", serviceSchema);
