import express from "express";

const router = express.Router();

import { requireSignin, verifyToken } from "../middlewares";

// import controllers
import { makeInstructor,currentInstructor, getAccountStatus } from "../controllers/instructor";

router.post("/make-instructor", verifyToken, makeInstructor);
router.post("/get-account-status", verifyToken, getAccountStatus);
router.get("/current-instructor", verifyToken, currentInstructor);

module.exports = router;
