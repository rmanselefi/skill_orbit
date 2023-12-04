import express from "express";
import formidable from "express-formidable";

const router = express.Router();

import { isInstuctor, verifyToken } from "../middlewares";

// import controllers
import {
  uploadImage,
  create,
  getCourse,
  uploadVideo,
  removeVideo
} from "../controllers/course";

router.post("/course/upload-image", verifyToken, uploadImage);
router.post("/course/upload-video", verifyToken, formidable(), uploadVideo);
router.post("/course/remove-video", verifyToken, removeVideo);

router.post("/course", verifyToken, isInstuctor, create);
router.get("/course/:slug", getCourse);

module.exports = router;
