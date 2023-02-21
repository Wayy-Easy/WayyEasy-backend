import express from "express";
import {
  createUsersBookedPhysician,
  fetchUsersBookedPhysician,
  addUserPrescription,
} from "../../controllers/physiciansController/physiciansBookedByUsers.js";
import { doctorsSignin, verifyUser } from "../../middlewares/auth.js";

const router = express.Router();

router.get(
  "/getPhysiciansUsersById/:physicianId",
  doctorsSignin,
  fetchUsersBookedPhysician
);

router.post(
  "/addUsersUnderPhysician/:physicianId",
  verifyUser,
  createUsersBookedPhysician
);

router.post(
  "/addUserPrescriptions/:userId",
  doctorsSignin,
  addUserPrescription
);

export default router;
