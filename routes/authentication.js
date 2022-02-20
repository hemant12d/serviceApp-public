import express from "express";
const router = express.Router();

import authController from "../App/controllers/authController.js";

// Middleware
import authenticator from "../App/middlewares/authenticator.js"

// Authentication Api endpoints
router.route("/register").post(authController.register);
router.route("/login").post(authController.login);
router.route("/forgetPassword").post(authController.forgetPassword);
router.route("/logout").post(authenticator, authController.logout);

router.route('/otp-for-login')
.post(authController.generateLoginOtp);

router.route('/login-with-otp')
.post(authController.loginViaOtp);


export default router;
