import express from "express";

const router = express.Router();

import { requireSignin } from "../middlewares";

// import controllers
import { register, login, logout, currentUser } from "../controllers/auth";

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/currentUser", requireSignin, currentUser);

module.exports = router;
