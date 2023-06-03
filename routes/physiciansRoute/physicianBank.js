import express from "express";
import { addBank } from "../../controllers/physiciansController/physicianBank.js";
import { doctorsSignin } from "../../middlewares/auth.js";

const router = express.Router();

router.route("/").post(doctorsSignin, addBank);

export default router;
