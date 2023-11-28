import express from "express";

const router = express.Router();

import { requireSignin, verifyToken } from "../middlewares";

// import controllers
import { makeInstructor,currentInstructor, getAccountStatus, instructorCourses } from "../controllers/instructor";

router.post("/make-instructor", verifyToken, makeInstructor);
router.post("/get-account-status", verifyToken, getAccountStatus);
router.get("/current-instructor", verifyToken, currentInstructor);
router.get("/instructor-courses", verifyToken, instructorCourses);

module.exports = router;
