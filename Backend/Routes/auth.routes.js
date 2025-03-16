import express from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser, forgotPassword, resetPassword} from "../Controller/auth.controller.js";
import { verifyUserJWT } from "../Middlewares/auth.middleware.js";

const router = express.Router();

//User auth routes:
router.post("/register-user", registerUser);
router.post("/login-user", loginUser);
router.post("/logout-user", verifyUserJWT, logoutUser);
router.post('/refresh-token', refreshAccessToken);
router.post('/forgot-password',forgotPassword);
router.post('/reset-password',resetPassword);

export default router;