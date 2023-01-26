import express from "express";
import {
  createOPD,
  deleteOPD,
  editOPD,
  fetchOPDServices,
  fetchSingleOPD,
} from "../../controllers/opdContollers/opds.js";
import { requireSignin } from "../../middlewares/auth.js";

const router = express.Router();

router.post("/create", requireSignin, createOPD);
router.get("/view/:id", requireSignin, fetchSingleOPD);
router.get("/viewAll", requireSignin, fetchOPDServices);
router.patch("/edit/:id", requireSignin, editOPD);
router.delete("/remove/:id", requireSignin, deleteOPD);

export default router;
