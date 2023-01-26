import express from "express";
import {
  createDoctor,
  editDoctor,
  viewDoctor,
  deleteDoctor,
  fetchSingleDoctor,
  getDoctorsByHospital,
} from "../../controllers/hospitalControllers/doctorController.js";
import { requireSignin, verifyUser } from "../../middlewares/auth.js";

const router = express.Router();

router.post("/create", requireSignin, createDoctor);
router.get("/view", requireSignin, viewDoctor);
router.get("/view/:id", requireSignin, fetchSingleDoctor);
router.patch("/update/:id", requireSignin, editDoctor);
router.delete("/delete/:id", requireSignin, deleteDoctor);

//App
router.get(
  "/getDoctorsByHospital/:hospitalId",
  verifyUser,
  getDoctorsByHospital
);

export default router;
