import { Router } from "express";

import {
    getRekomendasi,
    getRekomendasiById,
    createRekomendasi,
    getHasilRekomendasi,
} from "../controllers/rekomendasi.controller.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();

router.get("/", getRekomendasi);

router.get("/:id", getRekomendasiById);

router.get("/:id/hasil", getHasilRekomendasi);

router.post("/", createRekomendasi);

router.get(
  "/",
  authenticate,
  getRekomendasi
);

router.get(
  "/:id",
  authenticate,
  getRekomendasiById
);

router.get(
  "/:id/hasil",
  authenticate,
  getHasilRekomendasi
);

router.post(
  "/",
  authenticate,
  authorize("MAHASISWA"),
  createRekomendasi
);

export default router;