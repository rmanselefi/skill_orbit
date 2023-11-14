import express from "express";

const router = express.Router();

import { requireSignin, verifyToken } from "../middlewares";

// import controllers
import { uploadImage } from "../controllers/course";

router.post("/course/upload-image", verifyToken, uploadImage);

module.exports = router;
