import express from "express";
import {
  fetchUserById,
  finishConsultancyByUser,
  getPhysiciansBooked,
  getUser,
  ratePhysician,
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
router.get("/physiciansBooked/:dataType", verifyUser, getPhysiciansBooked);

// for user app
router.patch('/finishConsultancyByUser/:physicianId', verifyUser, finishConsultancyByUser)
router.post('/ratings/:physicianId', verifyUser, ratePhysician)

//for doctors app
router.get("/fetchUserById/:userId", doctorsSignin, fetchUserById);

export default router;
