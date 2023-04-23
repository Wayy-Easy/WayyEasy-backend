import express from "express";
import { doctorsSignin, verifyUser } from "../../middlewares/auth.js";
import { addPrescription, getPrescriptionByPhysician, updatePrescription } from "../../controllers/bookings/physicianPrescription.js";

const router = express.Router();

//by doctor
//to create new prescription
router.post("/create/:userId", doctorsSignin, addPrescription);

// //by user
// //to get their own prescriptions
// router.get('/get/:userId', verifyUser, getPrescription)

//by user
//to get their own prescriptions
router.get('/getByPhysician/:userId', doctorsSignin, getPrescriptionByPhysician)

//by doctor
//to edit his/her prescription given to users
router.patch('/update/:userId', doctorsSignin, updatePrescription)

export default router;