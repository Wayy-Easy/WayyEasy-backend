import express from "express";
import {
  getPhysiciansBooked,
  getUser,
  signup,
  updateFCMToken,
  updateProfile,
  verifyOtp,
} from "../controllers/userController.js";
import { verifyUser } from "../middlewares/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verifyOTP", verifyOtp);
router.patch("/update", verifyUser, updateProfile);
router.patch("/updateFCMToken", verifyUser, updateFCMToken);
router.get("/getUser", verifyUser, getUser);
router.get("/physiciansBooked", verifyUser, getPhysiciansBooked);

export default router;
