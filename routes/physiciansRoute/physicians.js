import express from "express";
import {
  editPhysicians,
  fetchAllPhysicians,
  getPhysicianFCMTokenById,
  getPhysiciansById,
  logout,
  signin,
  signup,
  updateToken,
} from "../../controllers/physiciansController/physicians.js";
import {
  doctorsSignin,
  requireSignin,
  verifyUser,
} from "../../middlewares/auth.js";

const router = express.Router();

router.post("/Signup", signup);
router.post("/login", signin);
router.post("/signout", doctorsSignin, logout);
router.get("/getPhysiciansById/:physicianId", doctorsSignin, getPhysiciansById);
router.patch("/updateToken", doctorsSignin, updateToken);

router.get(
  "/getPhysiciansTokenByUser/:physicianId",
  verifyUser,
  getPhysicianFCMTokenById
);
router.get("/getPhysician/:dataType", verifyUser, fetchAllPhysicians);
router.patch("/edit/:id", requireSignin, editPhysicians);

export default router;
