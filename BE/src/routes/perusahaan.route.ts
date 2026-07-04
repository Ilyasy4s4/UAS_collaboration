import { Router } from "express";
import {
  getPerusahaan,
  getPerusahaanById,
  createPerusahaan,
  updatePerusahaan,
  deletePerusahaan,
} from "../controllers/perusahaan.controller.js";
import { authorize } from "../middlewares/role.middleware.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", getPerusahaan);
router.get("/:id", getPerusahaanById);

router.post("/", createPerusahaan);

router.put("/:id", updatePerusahaan);

router.delete("/:id", deletePerusahaan);

router.post(
  "/",
  authenticate,
  authorize("ADMIN", "SUPER_ADMIN"),
  createPerusahaan
);

router.put(
  "/:id",
  authenticate,
  authorize("ADMIN", "SUPER_ADMIN"),
  updatePerusahaan
);

router.delete(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN"),
  deletePerusahaan
);

export default router;