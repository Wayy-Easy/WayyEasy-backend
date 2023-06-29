import express from "express";
import { doctorsSignin, verifyUser } from "../../middlewares/auth.js";
import { addPrescription, getPrescriptionByPhysician, getPrescriptionByUser, updatePrescription } from "../../controllers/physiciansController/physicianPrescription.js";

const router = express.Router();

//by doctor
//to create new prescription
router.post("/create/:userId", doctorsSignin, addPrescription);

//by user
//to get their own prescriptions
router.get('/getByUser/:physicianId', verifyUser, getPrescriptionByUser)

//by user
//to get their own prescriptions
router.get('/getByPhysician/:userId', doctorsSignin, getPrescriptionByPhysician)

//by doctor
//to edit his/her prescription given to users
router.patch('/update/:userId', doctorsSignin, updatePrescription)

export default router;
