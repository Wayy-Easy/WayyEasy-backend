import express from 'express';
import { createPathLab, deletePathLab, editPathLab, fetchAllPathLabs, fetchSinglePathLab } from '../../controllers/pathLabControllers/pathLabs.js';
import { requireSignin, verifyUser } from '../../middlewares/auth.js';

const router = express.Router()

router.post("/create", requireSignin, createPathLab);
router.get("/view/:id", requireSignin, fetchSinglePathLab);
router.patch("/edit/:id", requireSignin, editPathLab);
router.delete("/remove/:id", requireSignin, deletePathLab);

//android routes
router.get("/viewAll", verifyUser, fetchAllPathLabs);
export default router;