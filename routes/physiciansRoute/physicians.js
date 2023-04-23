import express from "express";
import {
  editPhysicians,
  fetchAllPhysicians,
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


//unchecked
router.patch("/edit/:id", requireSignin, editPhysicians);

router.get("/getPhysician", verifyUser, fetchAllPhysicians);
router.get(
  "/getPhysiciansFromUser/:physicianId",
  verifyUser,
  getPhysiciansById
);

export default router;
