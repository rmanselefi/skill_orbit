import AWS from "aws-sdk";
import slugify from "slugify";
import Course from '../models/course'

import { nanoid } from "nanoid";
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
  try{
    const alreadyExist = await Course.findOne({
      slug: slugify(req.body.name.toLowerCase()),
    }).exec();
    if (alreadyExist) {
      return res.status(400).send("Title is taken");
    }
    const course = await new Course({
      slug: slugify(req.body.name),
      instructor: req.user._id,
      ...req.body,
    }).save();
    res.json(course);
  }
  catch(error){
    console.log(error)
    return res.status(400).send("Create course failed. Try again.")
  }
}
