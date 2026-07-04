import express from "express";

import {
  getKampus,
  getKampusById,
  createKampus,
  updateKampus,
  deleteKampus,
} from "../controllers/kampus.controller.js";
import { authorize } from "../middlewares/role.middleware.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getKampus);
router.get("/:id", getKampusById);
router.post("/", createKampus);
router.put("/:id", updateKampus);
router.delete("/:id", deleteKampus);
router.post(
    "/",
    authenticate,
    authorize("SUPER_ADMIN"),
    createKampus
);

export default router;