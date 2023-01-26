import express from 'express';
import { createRating, deleteRating, editRating, getRatingsByHospital, viewRating } from '../../controllers/hospitalControllers/ratingController.js';
import {requireSignin, verifyUser} from "../../middlewares/auth.js"

const router = express.Router()

router.post("/create", requireSignin, createRating);
router.get("/view", requireSignin, viewRating)
router.get("/viewRatingsByHospital/:hospitalId", requireSignin, getRatingsByHospital)
router.get("/view/:id", requireSignin, viewRating)
router.patch("/update/:id", requireSignin, editRating);
router.delete("/delete/:id", requireSignin, deleteRating)

//App
router.get("/getRatingsByHospital/:hospitalId", verifyUser, getRatingsByHospital)

export default router