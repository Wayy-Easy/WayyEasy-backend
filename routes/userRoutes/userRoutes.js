import express from "express";
import {
  finishConsultancyByUser,
  getUser,
  ratePhysician,
  signup,
  updateProfile,
  verifyOtp,
} from "../../controllers/userControllers/userController.js";
import { verifyUser } from "../../middlewares/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verifyOTP", verifyOtp);
router.patch("/update", verifyUser, updateProfile);
router.get("/getUser", verifyUser, getUser);

// for user app
router.patch(
  "/finishConsultancyByUser/:physicianId",
  verifyUser,
  finishConsultancyByUser
);
router.post("/ratings/:physicianId", verifyUser, ratePhysician);

//for doctors app

export default router;
