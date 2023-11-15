const mongoose = require("mongoose");

const { Schema } = mongoose;

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minLenght: 3,
      maxLenght: 320,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: {},
      required: true,
      minLenght: 200,
      maxLenght: 200000,
    },
    price: {
      type: Number,
      default: 9.99,
    },
    image: {
      type: {},
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    published: {
      type: Boolean,
      default: false,
    },
    paid: {
      type: Boolean,
      default: true,
    },
    instructor: {
      type: Schema.ObjectId,
      ref: "User",
      required: true,
    },
    lessons: [lessonSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);

