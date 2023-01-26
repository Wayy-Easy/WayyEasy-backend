import express from 'express';
import { createHospital, deleteHospital, editHospital, fetchSingleHospital, viewAllHospital, viewHospital } from '../../controllers/hospitalControllers/hospitalController.js';
import { requireSignin, verifyUser } from '../../middlewares/auth.js';

const router = express.Router()

router.post("/create", requireSignin, createHospital)
router.get("/view", requireSignin, viewHospital)
router.get("/view/:id", requireSignin, fetchSingleHospital)
router.patch("/update/:id", requireSignin, editHospital)
router.delete("/delete/:id", requireSignin, deleteHospital)

// User apis
router.get("/userView", verifyUser, viewAllHospital);

export default router