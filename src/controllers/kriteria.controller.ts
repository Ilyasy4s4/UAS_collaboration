import { Request, Response } from "express";
import { prisma } from "../lib/db.js";

// ======================
// GET ALL
// ======================
export const getKriteria = async (
  req: Request,
  res: Response
) => {
  try {
    const data = await prisma.kriteria.findMany({
      orderBy: {
        id: "asc",
      },
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data kriteria",
      error,
    });
  }
};

// ======================
// GET BY ID
// ======================
export const getKriteriaById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const data = await prisma.kriteria.findUnique({
      where: {
        id,
      },
    });

    if (!data) {
      return res.status(404).json({
        message: "Kriteria tidak ditemukan",
      });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data",
      error,
    });
  }
};

// ======================
// CREATE
// ======================
export const createKriteria = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      kode,
      nama,
      tipe
    } = req.body;

    if (!kode || !nama || !tipe) {
      return res.status(400).json({
        message: "Data belum lengkap",
      });
    }

    const data = await prisma.kriteria.create({
      data: {
        kode,
        nama,
        tipe,
      },
    });

    res.status(201).json({
      message: "Kriteria berhasil ditambahkan",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menambahkan kriteria",
      error,
    });
  }
};

// ======================
// UPDATE
// ======================
export const updateKriteria = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const {
      kode,
      nama,
      tipe
    } = req.body;

    const data = await prisma.kriteria.update({
      where: {
        id,
      },
      data: {
        kode,
        nama,
        tipe,
      },
    });

    res.json({
      message: "Kriteria berhasil diupdate",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengupdate kriteria",
      error,
    });
  }
};

// ======================
// DELETE
// ======================
export const deleteKriteria = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    await prisma.kriteria.delete({
      where: {
        id,
      },
    });

    res.json({
      message: "Kriteria berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menghapus kriteria",
      error,
    });
  }
};