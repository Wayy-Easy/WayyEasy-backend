import express from 'express';
import { logout, signin, signup } from '../../controllers/hospitalControllers/ownerController.js';

const router = express.Router()

router.post("/signup", signup)
router.post("/signin", signin)
router.post("/signout", logout)

export default router