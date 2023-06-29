import express from "express";
import { doctorsSignin, verifyUser } from "../../middlewares/auth.js";
import {
  bookPhysician,
  fetchAllBookingsByPhysician,
  fetchPhysiciansByUser,
  fetchSinglePhysicianConsultationPendingByUser,
  finishConsultation,
} from "../../controllers/physiciansController/physicianBookings.js";

const router = express.Router();

//by user
//to book physician
router.post("/bookPhysician/:physicianId", verifyUser, bookPhysician);

//by user
//to finish consultation
router.patch(
  "/finishConsultation/:physicianId",
  verifyUser,
  finishConsultation
);

//by user
//fetch physician to check whether consultartion pending or not
router.get(
  "/fetchPhysicianConsultationStatus/:physicianId",
  verifyUser,
  fetchSinglePhysicianConsultationPendingByUser
);

//by user
//fetch all booking who are finished and who are pending
router.get(
  "/fetchAllPhysiciansByUser/:dataType",
  verifyUser,
  fetchPhysiciansByUser
);

//by physicians
//to get all bookings
router.get(
  "/fetchAllUsersByPhysician",
  doctorsSignin,
  fetchAllBookingsByPhysician
);

export default router;
