import express from "express";

const router = express.Router();

import { requireSignin, verifyToken } from "../middlewares";

// import controllers
import { register, login, logout, currentUser, sendTestEmail } from "../controllers/auth";

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/current-user", verifyToken, currentUser);
router.get('/send-email', sendTestEmail)

module.exports = router;
