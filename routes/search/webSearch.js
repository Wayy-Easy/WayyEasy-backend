import express from "express";
import { getDatainWebSearch } from "../../controllers/search/webSearch.js";

const router = express.Router();

router.get('/', getDatainWebSearch)

export default router;
