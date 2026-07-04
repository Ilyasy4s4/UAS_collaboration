import { Router } from "express";

import {
  getRating,
  getRatingById,
  createRating,
  updateRating,
  deleteRating,
} from "../controllers/rating.controller.js";
import { authorize } from "../middlewares/role.middleware.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", getRating);
router.get("/:id", getRatingById);
router.post("/", createRating);
router.put("/:id", updateRating);
router.delete("/:id", deleteRating);

router.post(
  "/",
  authenticate,
  authorize("MAHASISWA"),
  createRating
);

router.put(
  "/:id",
  authenticate,
  authorize("MAHASISWA"),
  updateRating
);

router.delete(
  "/:id",
  authenticate,
  authorize("MAHASISWA"),
  deleteRating
);

export default router;