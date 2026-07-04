import { Request, Response } from "express";
import { prisma } from "../lib/db.js";

/**
 * ===============================
 * GET ALL PERUSAHAAN
 * ===============================
 */
export const getPerusahaan = async (
  req: Request,
  res: Response
) => {
  try {
    const perusahaan = await prisma.perusahaan.findMany({
      include: {
        bidang: true,
        kampus: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    res.status(200).json(perusahaan);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Gagal mengambil data perusahaan",
      error,
    });
  }
};

/**
 * ===============================
 * GET PERUSAHAAN BY ID
 * ===============================
 */
export const getPerusahaanById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const perusahaan = await prisma.perusahaan.findUnique({
      where: {
        id,
      },
      include: {
        bidang: true,
        kampus: true,
      },
    });

    if (!perusahaan) {
      return res.status(404).json({
        message: "Perusahaan tidak ditemukan",
      });
    }

    res.status(200).json(perusahaan);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Gagal mengambil data perusahaan",
      error,
    });
  }
};

/**
 * ===============================
 * CREATE PERUSAHAAN
 * ===============================
 */
export const createPerusahaan = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      nama,
      deskripsi,
      alamat,
      kota,
      modeKerja,
      image,
      bidangId,
      kampusId,
    } = req.body;

    if (
      !nama ||
      !alamat ||
      !kota ||
      !modeKerja ||
      !bidangId ||
      !kampusId
    ) {
      return res.status(400).json({
        message: "Semua field wajib diisi",
      });
    }

    const perusahaan = await prisma.perusahaan.create({
      data: {
        nama,
        deskripsi,
        alamat,
        kota,
        modeKerja,
        image,
        bidangId: Number(bidangId),
        kampusId: Number(kampusId),
      },
      include: {
        bidang: true,
        kampus: true,
      },
    });

    res.status(201).json({
      message: "Perusahaan berhasil ditambahkan",
      data: perusahaan,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Gagal menambahkan perusahaan",
      error,
    });
  }
};

/**
 * ===============================
 * UPDATE PERUSAHAAN
 * ===============================
 */
export const updatePerusahaan = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const {
      nama,
      deskripsi,
      alamat,
      kota,
      modeKerja,
      image,
      bidangId,
      kampusId,
    } = req.body;

    const perusahaan = await prisma.perusahaan.update({
      where: {
        id,
      },
      data: {
        nama,
        deskripsi,
        alamat,
        kota,
        modeKerja,
        image,
        bidangId: Number(bidangId),
        kampusId: Number(kampusId),
      },
      include: {
        bidang: true,
        kampus: true,
      },
    });

    res.status(200).json({
      message: "Perusahaan berhasil diperbarui",
      data: perusahaan,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Gagal mengupdate perusahaan",
      error,
    });
  }
};

/**
 * ===============================
 * DELETE PERUSAHAAN
 * ===============================
 */
export const deletePerusahaan = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    await prisma.perusahaan.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      message: "Perusahaan berhasil dihapus",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Gagal menghapus perusahaan",
      error,
    });
  }
};