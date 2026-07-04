import express from "express";

import {
  getNilaiKriteria,
  getNilaiKriteriaById,
  createNilaiKriteria,
  updateNilaiKriteria,
  deleteNilaiKriteria,
} from "../controllers/nilaiKriteria.controller.js";

const router = express.Router();

router.get("/", getNilaiKriteria);

router.get("/:id", getNilaiKriteriaById);

router.post("/", createNilaiKriteria);

router.put("/:id", updateNilaiKriteria);

router.delete("/:id", deleteNilaiKriteria);

export default router;