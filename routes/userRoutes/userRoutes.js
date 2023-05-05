import express from "express";
import {
  getUser,
  ratePhysician,
  signup,
  updateFCMToken,
  updateProfile,
  verifyOtp,
} from "../../controllers/userControllers/userController.js";
import { verifyUser } from "../../middlewares/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verifyOTP", verifyOtp);
router.patch("/update", verifyUser, updateProfile);
router.get("/getUser", verifyUser, getUser);
router.patch('/updateFCMToken', verifyUser, updateFCMToken)

router.post("/ratings/:physicianId", verifyUser, ratePhysician);

export default router;
