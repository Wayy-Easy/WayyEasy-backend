import express from "express";
import {
  editPhysicians,
  fetchAllPhysicians,
  getPhysiciansById,
  logout,
  signin,
  signup,
  updateToken,
} from "../../controllers/physiciansController/physiciansAuth.js";
import { doctorsSignin, verifyUser } from "../../middlewares/auth.js";

const router = express.Router();

router.post("/Signup", signup);
router.post("/login", signin);
router.post("/signout", doctorsSignin, logout);
router.get("/getPhysiciansById/:physicianId", doctorsSignin, getPhysiciansById);
router.patch("/edit/:id", doctorsSignin, editPhysicians);
router.patch("/updateToken", doctorsSignin, updateToken);

// user routes
router.get("/getPhysician", verifyUser, fetchAllPhysicians);
router.get("/getPhysicianBookedByUser/:physicianId", verifyUser, getPhysiciansById);

export default router;
