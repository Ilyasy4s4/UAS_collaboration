import express from "express";

import {
  getBidang,
  getBidangById,
  createBidang,
  updateBidang,
  deleteBidang,
} from "../controllers/bidang.controller.js";

const router = express.Router();

router.get("/", getBidang);

router.get("/:id", getBidangById);

router.post("/", createBidang);

router.put("/:id", updateBidang);

router.delete("/:id", deleteBidang);

export default router;