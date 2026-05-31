import express from "express";
import {register, sendOTP, verifyOTP, logout} from "../controllers/authController.js"

const router=express.Router();

router.post("/register", register); //endpoint in 1st parameter and function to run on this paramter in 2nd parameter
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/logout", logout);

export default router;