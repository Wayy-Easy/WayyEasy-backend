import express from "express";
import {
  fetchUserById,
  getPhysiciansBooked,
  getUser,
  signup,
  updateFCMToken,
  updateProfile,
  verifyOtp,
} from "../../controllers/userControllers/userController.js";
import { doctorsSignin, verifyUser } from "../../middlewares/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verifyOTP", verifyOtp);
router.patch("/update", verifyUser, updateProfile);
router.patch("/updateFCMToken", verifyUser, updateFCMToken);
router.get("/getUser", verifyUser, getUser);
router.get("/physiciansBooked", verifyUser, getPhysiciansBooked);

//for doctors app
router.get("/fetchUserById/:userId", doctorsSignin, fetchUserById);

export default router;
