import AWS from "aws-sdk";
import slugify from "slugify";
import Course from "../models/course";
import fs from "fs";

import { nanoid } from "nanoid";
import { Console } from "console";
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
    const course = await Course.findOne({
      slug: req.params.slug,
    })
      .populate("instructor", "_id name")
      .exec();
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
      Key: `${nanoid()}.${video.type.split(".")[1]}`,
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
