import { Request, Response } from "express";
import { prisma } from "../lib/db.js";

/**
 * ===============================
 * GET ALL RATING
 * ===============================
 */
export const getRating = async (
  req: Request,
  res: Response
) => {
  try {
    const rating = await prisma.rating.findMany({
      include: {
        user: true,
        perusahaan: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    res.status(200).json(rating);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Gagal mengambil data rating",
      error,
    });
  }
};

/**
 * ===============================
 * GET RATING BY ID
 * ===============================
 */
export const getRatingById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const rating = await prisma.rating.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        perusahaan: true,
      },
    });

    if (!rating) {
      return res.status(404).json({
        message: "Rating tidak ditemukan",
      });
    }

    res.status(200).json(rating);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Gagal mengambil data rating",
      error,
    });
  }
};

/**
 * ===============================
 * CREATE RATING
 * ===============================
 */
export const createRating = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      userId,
      perusahaanId,
      rating,
      review,
    } = req.body;

    if (
      !userId ||
      !perusahaanId ||
      rating === undefined
    ) {
      return res.status(400).json({
        message: "Semua field wajib diisi",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating harus antara 1 sampai 5",
      });
    }

    const data = await prisma.rating.create({
      data: {
        userId: Number(userId),
        perusahaanId: Number(perusahaanId),
        rating: Number(rating),
        review,
      },
      include: {
        user: true,
        perusahaan: true,
      },
    });

    res.status(201).json({
      message: "Rating berhasil ditambahkan",
      data,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Gagal menambahkan rating",
      error,
    });
  }
};

/**
 * ===============================
 * UPDATE RATING
 * ===============================
 */
export const updateRating = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const {
      userId,
      perusahaanId,
      rating,
      review,
    } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating harus antara 1 sampai 5",
      });
    }

    const data = await prisma.rating.update({
      where: {
        id,
      },
      data: {
        userId: Number(userId),
        perusahaanId: Number(perusahaanId),
        rating: Number(rating),
        review,
      },
      include: {
        user: true,
        perusahaan: true,
      },
    });

    res.status(200).json({
      message: "Rating berhasil diperbarui",
      data,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Gagal mengupdate rating",
      error,
    });
  }
};

/**
 * ===============================
 * DELETE RATING
 * ===============================
 */
export const deleteRating = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    await prisma.rating.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      message: "Rating berhasil dihapus",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Gagal menghapus rating",
      error,
    });
  }
};