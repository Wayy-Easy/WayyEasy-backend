import express from "express";
import {
  createUsersBookedPhysician,
  fetchUsersBookedPhysician,
  addUserPrescription,
  finishConsultancyByDoctor,
} from "../../controllers/physiciansController/usersUnderPhysicians.js";
import { doctorsSignin, verifyUser } from "../../middlewares/auth.js";

const router = express.Router();

router.get("/getUsersUnderPhysician", doctorsSignin, fetchUsersBookedPhysician);

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

router.patch(
  "/finishConsultancyByDoctor/:userId",
  doctorsSignin,
  finishConsultancyByDoctor
);

export default router;
