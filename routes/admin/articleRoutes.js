import express from "express";
import {
  createArticle,
  editArticle,
  getArticles,
  handleFeaturedArticle,
  removeArticle,
} from "../../controllers/admin/articlesController.js";
import { requireSignin } from "../../middlewares/auth.js";

const router = express.Router();

router
  .route("/")
  .post(requireSignin, createArticle)
  .patch(requireSignin, editArticle)
  .delete(requireSignin, removeArticle)
  .get(getArticles);

router.route("/featured").patch(requireSignin, handleFeaturedArticle);

export default router;
