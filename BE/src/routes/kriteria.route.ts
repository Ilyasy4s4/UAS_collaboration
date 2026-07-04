import express from "express";

import {
  getKriteria,
  getKriteriaById,
  createKriteria,
  updateKriteria,
  deleteKriteria,
} from "../controllers/kriteria.controller.js";

const router = express.Router();

router.get("/", getKriteria);

router.get("/:id", getKriteriaById);

router.post("/", createKriteria);

router.put("/:id", updateKriteria);

router.delete("/:id", deleteKriteria);

export default router;