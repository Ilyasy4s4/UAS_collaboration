import { Request, Response } from "express";
import { prisma } from "../lib/db.js";

/**
 * ===============================
 * GET ALL BIDANG
 * ===============================
 */
export const getBidang = async (
  req: Request,
  res: Response
) => {
  try {
    const bidang = await prisma.bidang.findMany({
      orderBy: {
        id: "asc",
      },
    });

    res.status(200).json(bidang);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data bidang",
      error,
    });
  }
};

/**
 * ===============================
 * GET BIDANG BY ID
 * ===============================
 */
export const getBidangById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const bidang = await prisma.bidang.findUnique({
      where: {
        id,
      },
    });

    if (!bidang) {
      return res.status(404).json({
        message: "Bidang tidak ditemukan",
      });
    }

    res.status(200).json(bidang);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data bidang",
      error,
    });
  }
};

/**
 * ===============================
 * CREATE BIDANG
 * ===============================
 */
export const createBidang = async (
  req: Request,
  res: Response
) => {
  try {
    const { nama, deskripsi } = req.body;

    if (!nama) {
      return res.status(400).json({
        message: "Nama bidang wajib diisi",
      });
    }

    const bidang = await prisma.bidang.create({
      data: {
        nama,
        deskripsi,
      },
    });

    res.status(201).json({
      message: "Bidang berhasil ditambahkan",
      data: bidang,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menambahkan bidang",
      error,
    });
  }
};

/**
 * ===============================
 * UPDATE BIDANG
 * ===============================
 */
export const updateBidang = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const { nama, deskripsi } = req.body;

    const bidang = await prisma.bidang.update({
      where: {
        id,
      },
      data: {
        nama,
        deskripsi,
      },
    });

    res.status(200).json({
      message: "Bidang berhasil diperbarui",
      data: bidang,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengupdate bidang",
      error,
    });
  }
};

/**
 * ===============================
 * DELETE BIDANG
 * ===============================
 */
export const deleteBidang = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    await prisma.bidang.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      message: "Bidang berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menghapus bidang",
      error,
    });
  }
};