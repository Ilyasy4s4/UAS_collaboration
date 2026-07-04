import { Request, Response } from "express";
import { prisma } from "../lib/db.js";
import bcrypt from "bcrypt";

/**
 * ===============================
 * CREATE USER
 * ===============================
 */
export const createUser = async (
  req: Request,
  res: Response
) => {
  try {

    const {
      name,
      email,
      password,
      role,
      kampusId,
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Semua field wajib diisi",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email sudah digunakan",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        kampusId: kampusId ? Number(kampusId) : null,
      },
    });

    res.status(201).json({
      message: "User berhasil ditambahkan",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        kampusId: user.kampusId,
      },
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Terjadi kesalahan server",
    });

  }
};

/**
 * ===============================
 * GET ALL USER
 * ===============================
 */
export const getUsers = async (
  req: Request,
  res: Response
) => {
  try {

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        kampus: {
          select: {
            id: true,
            nama: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    res.status(200).json({
      message: "Berhasil mengambil data user",
      data: users,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Terjadi kesalahan server",
    });

  }
};

/**
 * ===============================
 * GET USER BY ID
 * ===============================
 */
export const getUserById = async (
  req: Request,
  res: Response
) => {
  try {

    const id = Number(req.params.id);

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        kampus: {
          select: {
            id: true,
            nama: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    res.status(200).json({
      message: "Berhasil mengambil detail user",
      data: user,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Terjadi kesalahan server",
    });

  }
};

/**
 * ===============================
 * UPDATE USER
 * ===============================
 */
export const updateUser = async (
  req: Request,
  res: Response
) => {
  try {

    const id = Number(req.params.id);

    const {
      name,
      email,
      password,
      role,
      kampusId,
    } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    const data: any = {
      name,
      email,
      role,
      kampusId: kampusId ? Number(kampusId) : null,
    };

    // Jika password diisi, hash ulang
    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data,
    });

    res.status(200).json({
      message: "User berhasil diupdate",
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        kampusId: updatedUser.kampusId,
      },
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Terjadi kesalahan server",
    });

  }
};

/**
 * ===============================
 * DELETE USER
 * ===============================
 */
export const deleteUser = async (
  req: Request,
  res: Response
) => {
  try {

    const id = Number(req.params.id);

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    await prisma.user.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      message: "User berhasil dihapus",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Terjadi kesalahan server",
    });

  }
};