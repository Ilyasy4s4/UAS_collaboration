import express from "express";

import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

import { authenticate } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

/**
 * ===============================
 * USER
 * ===============================
 */

// GET ALL USER
router.get(
  "/",
  authenticate,
  authorize("SUPER_ADMIN"),
  getUsers
);

// GET USER BY ID
router.get(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN"),
  getUserById
);

// CREATE USER
router.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN"),
  createUser
);

// UPDATE USER
router.put(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN"),
  updateUser
);

// DELETE USER
router.delete(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN"),
  deleteUser
);

export default router;