import express from "express";
import { requireSignin } from "../../middlewares/auth.js";
import { addPayment } from "../../controllers/admin/adminController.js";

const router = express.Router();

router.route("/").post(requireSignin, addPayment);

export default router;
