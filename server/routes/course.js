import express from "express";

const router = express.Router();

import { isInstuctor, verifyToken } from "../middlewares";

// import controllers
import { uploadImage, create, getCourse} from "../controllers/course";

router.post("/course/upload-image", verifyToken, uploadImage);

router.post("/course", verifyToken, isInstuctor, create);
router.get("/course/:slug", getCourse)

module.exports = router;
