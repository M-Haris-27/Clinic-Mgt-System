import express from "express";
import { verifyUserJWT } from "../Middlewares/auth.middleware.js";
import { getUserById, getUserProfile, updateUserProfile } from "../Controller/user.controller.js";


const router = express.Router();

//User auth routes:
router.get("/me", verifyUserJWT, getUserProfile);
router.put("/me", verifyUserJWT, updateUserProfile);
router.get("/:id", verifyUserJWT, getUserById);


export default router;