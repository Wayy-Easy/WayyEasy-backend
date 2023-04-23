import express from "express";
import { doctorsSignin, verifyUser } from "../../middlewares/auth.js";
import { bookPhysician, fetchAllBookingsByPhysician, fetchPhysiciansByUser, finishConsultation } from "../../controllers/bookings/physicianBookings.js";

const router = express.Router();

//by user
//to book user
router.post("/bookPhysician/:physicianId", verifyUser, bookPhysician);

//by user
//to finish consultation
router.patch("/finishConsultation/:physicianId", verifyUser, finishConsultation);

//by user
//fetch all booking who are finished, pending all physicians list
router.get("/fetchAllPhysiciansByUser/:dataType", verifyUser, fetchPhysiciansByUser);

//by physicians
//to get all bookings
router.get("/fetchAllUsersByPhysician", doctorsSignin, fetchAllBookingsByPhysician);

export default router;
