// const mongoose = require("mongoose");

// const { Schema } = mongoose;

// const lessonSchema = new Schema(
//   {
//     title: {
//       type: String,
//       trim: true,
//       min: 3,
//       max: 320,
//       required: true,
//     },
//     slug: {
//       type: String,
//       lowercase: true,
//       unique: true,
//       index: true,
//     },
//     content: {
//       type: {},
//       min: 200,
//       max: 2000000,
//     },
//     video: {},
//     free_preview: {
//       type: Boolean,
//       default: false,
//     },
//     course: {
//       type: Schema.Types.ObjectId,
//       ref: "Course",
//     },
//     published: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Lesson", lessonSchema);
