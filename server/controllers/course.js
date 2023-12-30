import AWS from "aws-sdk";
import slugify from "slugify";
import Course from "../models/course";
import fs from "fs";

import { nanoid } from "nanoid";
import { Console } from "console";
import User from "../models/user";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
});
export const uploadImage = async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).send("No image");
    const base64Data = new Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    const type = image.split(";")[0].split("/")[1];

    const params = {
      Bucket: "edemybucket",
      Key: `${nanoid()}.${type}`,
      Body: base64Data,
      ACL: "public-read",
      ContentEncoding: "base64",
      ContentType: "image/jpeg",
    };
    s3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        return res.sendStatus(400);
      }
      console.log(data);
      res.send(data);
    });
  } catch (error) {
    console.log(error);
  }
};

export const create = async (req, res) => {
  console.log("CREATE COURSE", req.body);
  try {
    const alreadyExist = await Course.findOne({
      slug: slugify(req.body.name.toLowerCase()),
    }).exec();
    if (alreadyExist) {
      return res.status(400).send("Title is taken");
    }
    const course = await new Course({
      slug: slugify(req.body.name),
      instructor: req.user._id,
      title: req.body.description,
      ...req.body,
    }).save();
    res.json(course);
  } catch (error) {
    console.log(error);
    return res.status(400).send("Create course failed. Try again.");
  }
};

export const getCourse = async (req, res) => {
  try {
    console.log("GET COURSE", req.params.slug);
    const course = await Course.findOne({
      slug: req.params.slug,
    })
      .populate("instructor", "_id name")
      .exec();
    console.log("COURSE => ", course);
    res.json(course);
  } catch (err) {
    console.log(err);
  }
};

export const uploadVideo = async (req, res) => {
  try {
    console.log("REQ.BODY", req.user._id);
    console.log("Param", req.params.instructorid);

    if (req.user._id.toString() !== req.params.instructorid) {
      return res.status(400).send("Unauthorized");
    }

    const { video } = req.files;
    console.log("REQ.FILE", video.type);
    if (!video) return res.status(400).send("No video");
    const params = {
      Bucket: "edemybucket",
      Key: `${nanoid()}.${video.type.split("/")[1]}`,
      Body: fs.readFileSync(video.path),
      ACL: "public-read",
      ContentType: "video/mp4",
    };
    s3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        return res.sendStatus(400);
      }
      console.log(data);
      res.send(data);
    });
  } catch (error) {
    console.log(error);
  }
};

export const removeVideo = async (req, res) => {
  try {
    console.log("REQ.BODY", req.body);
    console.log("REQ.FILE", req.files);
    const { Bucket, Key } = req.body;
    if (!video) return res.status(400).send("No video");
    const params = {
      Bucket,
      Key,
    };
    s3.deleteObject(params, (err, data) => {
      if (err) {
        console.log(err);
        return res.sendStatus(400);
      }
      console.log(data);
      res.send({ ok: true });
    });
  } catch (error) {
    console.log(error);
  }
};

export const addLesson = async (req, res) => {
  try {
    const { slug, instructorid } = req.params;
    const { title, content, video } = req.body;
    console.log(req.body);
    if (!title) return res.status(400).send("Title is required");
    if (!content) return res.status(400).send("Content is required");
    if (!slug) return res.status(400).send("Slug is required");
    if (!video) return res.status(400).send("Video is required");

    const updated = await Course.findOneAndUpdate(
      { slug, instructor: instructorid },
      {
        $push: { lessons: { title, content, video, slug: slugify(title) } },
      },
      { new: true }
    )
      .populate("instructor", "_id name")
      .exec();
    console.log("updated", updated);
    res.json(updated);
  } catch (error) {
    console.log(error);
    return res.status(400).send("Add lesson failed");
  }
};

export const update = async (req, res) => {
  const { slug } = req.params;
  try {
    const course = await Course.findOne({ slug }).exec();

    if (req.user._id.toString() !== course.instructor.toString()) {
      return res.status(400).send("Unauthorized");
    }
    const updated = await Course.findOneAndUpdate({ slug }, req.body, {
      new: true,
    }).exec();
    res.json(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Course update failed");
  }
};

export const removeLesson = async (req, res) => {
  const { slug, lessonid } = req.params;
  const course = await Course.findOne({ slug }).exec();

  if (req.user._id.toString() !== course.instructor.toString()) {
    return res.status(400).send("Unauthorized");
  }

  const deleted = await Course.findByIdAndDelete(course._id, {
    $pull: { lessons: { _id: lessonid } },
  }).exec();

  res.json({
    ok: true,
  });
};

export const updateLesson = async (req, res) => {
  try {
    const { slug, lessonid } = req.params;
    const { title, content, video, free_preview } = req.body;
    const course = await Course.findOne({ slug }).exec();
    if (req.user._id.toString() !== course.instructor._id.toString()) {
      return res.status(400).send("Unauthorized");
    }
    if (!title) return res.status(400).send("Title is required");
    if (!content) return res.status(400).send("Content is required");
    if (!slug) return res.status(400).send("Slug is required");
    if (!video) return res.status(400).send("Video is required");

    const updated = await Course.updateOne(
      { slug, "lessons._id": lessonid },
      {
        $set: {
          "lessons.$.title": title,
          "lessons.$.content": content,
          "lessons.$.video": video,
          "lessons.$.free_preview": free_preview,
          "lessons.$.slug": slugify(title),
        },
      },
      { new: true }
    )
      .populate("instructor", "_id name")
      .exec();
    console.log("updated", updated);
    res.json(updated);
  } catch (error) {
    console.log(error);
    return res.status(400).send("Update lesson failed");
  }
};

export const publishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).select("instructor").exec();
    if (req.user._id.toString() !== course.instructor._id.toString()) {
      return res.status(400).send("Unauthorized");
    }
    let updated = await Course.findByIdAndUpdate(
      courseId,
      { published: true },
      { new: true }
    ).exec();
    res.json(updated);
  } catch (error) {
    console.log(error);
    return res.status(400).send("Publish course failed");
  }
};

export const unpublishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).select("instructor").exec();
    if (req.user._id.toString() !== course.instructor._id.toString()) {
      return res.status(400).send("Unauthorized");
    }
    let updated = await Course.findByIdAndUpdate(
      courseId,
      { published: false },
      { new: true }
    ).exec();
    res.json(updated);
  } catch (error) {
    console.log(error);
    return res.status(400).send("Unpublish course failed");
  }
};

export const getCourses = async (req, res) => {
  try {
    const all = await Course.find({ published: true })
      .populate("instructor", "_id name")
      .exec();
    res.json(all);
  } catch (error) {
    console.log(error);
  }
};

export const checkEnrollment = async (req, res) => {
  const { courseId } = req.params;
  // check if course with that id is already in user's courses array
  const user = await User.findById(req.user._id).exec();
  console.log("USER COURSES => ", user);
  let ids = [];
  if (user.courses) {
    for (let i = 0; i < user.courses.length; i++) {
      ids.push(user.courses[i].toString());
    }
  }
  res.json({
    status: ids && ids.includes(courseId),
    course: await Course.findById(courseId).exec(),
  });
};

export const freeEnrollment = async (req, res) => {
  const { courseId } = req.body;
  // check if course with that id is already in user's courses array
  const user = await User.findById(req.user._id).exec();
  console.log("USER COURSES => ", user);
  let ids = [];
  if (user.courses) {
    for (let i = 0; i < user.courses.length; i++) {
      ids.push(user.courses[i].toString());
    }
  }
  if (!ids.includes(courseId)) {
    user.courses.push(courseId);
    await user.save();
  }
  res.json({
    message: "Congratulations! You have successfully enrolled",
    course: await Course.findById(courseId).exec(),
  });
};

export const paidEnrollment = async (req, res) => {
  try {
    // check if course is free or paid
    const { courseId } = req.body;
    const course = await Course.findById(courseId)
      .populate("instructor")
      .exec();

    const paidFor = course.paid;
    if (!paidFor) return;

    // application fee 30%

    const fee = (course.price * 30) / 100;
    // create session

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      // purchase details
      line_items: [
        {
          name: course.title,
          amount: Math.round(course.price.toFixed(2)) * 100,
          currency: "usd",
          quantity: 1,
        },
      ],
      // charge buyer and transfer remaining blance to seller
      payment_intent_data: {
        application_fee_amount: Math.round(fee.toFixed(2)) * 100,
        transfer_data: {
          destination: course.instructor.stripe_account_id,
        },
      },
      success_url: `${process.env.STRIPE_SUCCESS_URL}/${course._id}`,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });

    console.log("SESSION => ", session);

    await User.findByIdAndUpdate(req.user._id, {
      stripeSession: session,
    }).exec();

    res.send(session);
  } catch (error) {
    console.log(error);
    res.status(400).send("Enrollment create failed");
  }
};
