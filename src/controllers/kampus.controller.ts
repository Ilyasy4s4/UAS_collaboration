import { Request, Response } from "express";
import { prisma } from "../lib/db.js";

/**
 * ===============================
 * GET ALL KAMPUS
 * ===============================
 */
export const getKampus = async (
  req: Request,
  res: Response
) => {
  try {
    const kampus = await prisma.kampus.findMany({
      orderBy: {
        id: "asc",
      },
    });

    res.status(200).json(kampus);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data kampus",
      error,
    });
  }
};

/**
 * ===============================
 * GET KAMPUS BY ID
 * ===============================
 */
export const getKampusById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const kampus = await prisma.kampus.findUnique({
      where: {
        id,
      },
    });

    if (!kampus) {
      return res.status(404).json({
        message: "Kampus tidak ditemukan",
      });
    }

    res.status(200).json(kampus);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data kampus",
      error,
    });
  }
};

/**
 * ===============================
 * CREATE KAMPUS
 * ===============================
 */
export const createKampus = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      nama,
      alamat,
      kota,
      logo,
    } = req.body;

    if (!nama) {
      return res.status(400).json({
        message: "Nama kampus wajib diisi",
      });
    }

    const kampus = await prisma.kampus.create({
      data: {
        nama,
        alamat,
        kota,
        logo,
      },
    });

    res.status(201).json({
      message: "Kampus berhasil ditambahkan",
      data: kampus,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menambahkan kampus",
      error,
    });
  }
};

/**
 * ===============================
 * UPDATE KAMPUS
 * ===============================
 */
export const updateKampus = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const {
      nama,
      alamat,
      kota,
      logo,
    } = req.body;

    const kampus = await prisma.kampus.update({
      where: {
        id,
      },
      data: {
        nama,
        alamat,
        kota,
        logo,
      },
    });

    res.status(200).json({
      message: "Kampus berhasil diperbarui",
      data: kampus,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengupdate kampus",
      error,
    });
  }
};

/**
 * ===============================
 * DELETE KAMPUS
 * ===============================
 */
export const deleteKampus = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    await prisma.kampus.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      message: "Kampus berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menghapus kampus",
      error,
    });
  }
};