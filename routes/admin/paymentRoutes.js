import express from "express";
import { requireSignin, verifyUser } from "../../middlewares/auth.js";
import {
  addPayment,
  finishPayment,
  getPaymentFullDetails,
  getPaymentLsit,
} from "../../controllers/admin/paymentsController.js";

const router = express.Router();

router
  .route("/")
  .post(verifyUser, addPayment)
  .get(requireSignin, getPaymentLsit);

router.route("/fullDetails").get(requireSignin, getPaymentFullDetails);

router.route("/finishPayment").patch(requireSignin, finishPayment);

export default router;
