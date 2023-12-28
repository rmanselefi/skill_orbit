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
  removeVideo,
  addLesson,
  update,
  removeLesson,
  updateLesson,
  publishCourse,
  unpublishCourse,
  getCourses,
} from "../controllers/course";

router.get("/courses", getCourses);
router.put("/course/publish/:courseId", verifyToken, isInstuctor, publishCourse);
router.put("/course/unpublish/:courseId", verifyToken, isInstuctor, unpublishCourse);
router.post("/course/upload-image", verifyToken, uploadImage);
router.post("/course/upload-video/:instructorid", verifyToken, formidable(), uploadVideo);
router.post("/course/remove-video/:instructorid", verifyToken, removeVideo);
router.post("/course/lesson/:slug/:instructorid", verifyToken, isInstuctor, addLesson);
router.put("/course/lesson/:slug/:instructorid", verifyToken, isInstuctor, updateLesson);
router.put("/course/:slug/:lessonid", verifyToken, isInstuctor, removeLesson);

router.post("/course", verifyToken, isInstuctor, create);
router.get("/course/:slug", getCourse);

router.put("/course/:slug", verifyToken, isInstuctor, update);


module.exports = router;
