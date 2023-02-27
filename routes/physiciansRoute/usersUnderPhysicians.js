import express from "express";
import {
  createUsersBookedPhysician,
  fetchUsersBookedPhysician,
  addUserPrescription,
} from "../../controllers/physiciansController/usersUnderPhysicians.js";
import { doctorsSignin, verifyUser } from "../../middlewares/auth.js";

const router = express.Router();

router.get(
  "/getUsersUnderPhysician/:physicianId",
  doctorsSignin,
  fetchUsersBookedPhysician
);

router.post(
  "/addUsersUnderPhysician/:physicianId",
  verifyUser,
  createUsersBookedPhysician
);

router.patch(
  "/addUserPrescriptions/:userId",
  doctorsSignin,
  addUserPrescription
);

export default router;
