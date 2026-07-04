import { Request, Response } from "express";
import { prisma } from "../lib/db.js";

// ==========================
// GET ALL
// ==========================
export const getNilaiKriteria = async (
  req: Request,
  res: Response
) => {
  try {
    const data = await prisma.nilaiKriteria.findMany({
      include: {
        perusahaan: true,
        kriteria: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data nilai kriteria",
      error,
    });
  }
};

// ==========================
// GET BY ID
// ==========================
export const getNilaiKriteriaById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const data = await prisma.nilaiKriteria.findUnique({
      where: {
        id,
      },
      include: {
        perusahaan: true,
        kriteria: true,
      },
    });

    if (!data) {
      return res.status(404).json({
        message: "Data tidak ditemukan",
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

// ==========================
// CREATE
// ==========================
export const createNilaiKriteria = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      perusahaanId,
      kriteriaId,
      nilaiSkala,
    } = req.body;

    if (
      !perusahaanId ||
      !kriteriaId ||
      !nilaiSkala
    ) {
      return res.status(400).json({
        message: "Data belum lengkap",
      });
    }

    const data = await prisma.nilaiKriteria.create({
      data: {
        perusahaanId: Number(perusahaanId),
        kriteriaId: Number(kriteriaId),
        nilaiSkala: Number(nilaiSkala),
      },
    });

    res.status(201).json({
      message: "Nilai berhasil ditambahkan",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menambahkan nilai",
      error,
    });
  }
};

// ==========================
// UPDATE
// ==========================
export const updateNilaiKriteria = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const {
      perusahaanId,
      kriteriaId,
      nilaiSkala,
    } = req.body;

    const data = await prisma.nilaiKriteria.update({
      where: {
        id,
      },
      data: {
        perusahaanId: Number(perusahaanId),
        kriteriaId: Number(kriteriaId),
        nilaiSkala: Number(nilaiSkala),
      },
    });

    res.json({
      message: "Nilai berhasil diupdate",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengupdate",
      error,
    });
  }
};

// ==========================
// DELETE
// ==========================
export const deleteNilaiKriteria = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    await prisma.nilaiKriteria.delete({
      where: {
        id,
      },
    });

    res.json({
      message: "Data berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menghapus",
      error,
    });
  }
};