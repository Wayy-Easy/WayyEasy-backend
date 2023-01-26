import express from "express";
import {
  createRoom,
  deleteRoom,
  editRoom,
  fetchRoomsByHospitals,
  fetchSingleRoom,
  viewRoom,
} from "../../controllers/hospitalControllers/roomsController.js";
import { requireSignin, verifyUser } from "../../middlewares/auth.js";

const router = express.Router();

router.post("/create", requireSignin, createRoom);
router.get("/view", requireSignin, viewRoom);
router.get("/view/:id", requireSignin, fetchSingleRoom);
router.patch("/update/:id", requireSignin, editRoom);
router.delete("/delete/:id", requireSignin, deleteRoom);

//App
router.get(
  "/getRoomsByHospital/:hospitalId",
  verifyUser,
  fetchRoomsByHospitals
);

export default router;
