import { Request, Response } from "express";
import { prisma } from "../lib/db.js";

/**
 * =====================================
 * GET ALL REKOMENDASI
 * =====================================
 */
export const getRekomendasi = async (
  req: Request,
  res: Response
) => {
  try {
    const data = await prisma.rekomendasi.findMany({
      include: {
        user: true,
        bidang: true,
        bobotRekomendasi: {
          include: {
            kriteria: true,
          },
        },
        hasilRekomendasi: {
          include: {
            perusahaan: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    res.status(200).json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Gagal mengambil data rekomendasi",
      error,
    });
  }
};

/**
 * =====================================
 * GET BY ID
 * =====================================
 */
export const getRekomendasiById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const data = await prisma.rekomendasi.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        bidang: true,
        bobotRekomendasi: {
          include: {
            kriteria: true,
          },
        },
        hasilRekomendasi: {
          include: {
            perusahaan: true,
          },
        },
      },
    });

    if (!data) {
      return res.status(404).json({
        message: "Rekomendasi tidak ditemukan",
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Gagal mengambil data",
      error,
    });
  }
};


/**
 * =====================================
 * CREATE REKOMENDASI
 * =====================================
 */
export const createRekomendasi = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      userId,
      bidangId,
      kotaFilter,
      modeFilter,
      bobot,
    } = req.body;

    if (
    !userId ||
    !bidangId ||
    !kotaFilter ||
    !modeFilter ||
    !Array.isArray(bobot) ||
    bobot.length === 0
    ) {
    return res.status(400).json({
        message: "Data belum lengkap",
    });
    }
    // ===========================
    // Simpan rekomendasi
    // ===========================
    const rekomendasi = await prisma.rekomendasi.create({
      data: {
        userId: Number(userId),
        bidangId: Number(bidangId),
        kotaFilter,
        modeFilter,
      },
    });

    // ===========================
    // Simpan bobot
    // ===========================
    await prisma.bobotRekomendasi.createMany({
      data: bobot.map((item: any) => ({
        rekomendasiId: rekomendasi.id,
        kriteriaId: Number(item.kriteriaId),
        bobot: Number(item.bobot),
      })),
    });

    // ===========================
    // Ambil perusahaan sesuai filter
    // ===========================
    const perusahaan = await prisma.perusahaan.findMany({
    where: {
        bidangId: Number(bidangId),
        kota: kotaFilter,
        modeKerja: modeFilter,
    },
    include: {
        bidang: true,
        kampus: true,
        nilaiKriteria: {
        include: {
            kriteria: true,
        },
        },
    },
    orderBy: {
        id: "asc",
    },
    });

    // ===========================
    // Belum ada hasil
    // ===========================
    if (perusahaan.length === 0) {
      return res.status(404).json({
        message: "Tidak ada perusahaan yang sesuai filter.",
      });
    }
    

    // ==========================================
// STEP 1
// Cari nilai MAX & MIN tiap kriteria
// ==========================================

const statistik: Record<
  number,
  {
    max: number;
    min: number;
    tipe: string;
  }
> = {};

for (const p of perusahaan) {

  for (const nilai of p.nilaiKriteria) {

    const id = nilai.kriteriaId;

    if (!statistik[id]) {

      statistik[id] = {
        max: nilai.nilaiSkala,
        min: nilai.nilaiSkala,
        tipe: nilai.kriteria.tipe,
      };

    } else {

      if (nilai.nilaiSkala > statistik[id].max)
        statistik[id].max = nilai.nilaiSkala;

      if (nilai.nilaiSkala < statistik[id].min)
        statistik[id].min = nilai.nilaiSkala;

    }

  }

}

console.log(statistik);

// ==========================================
// STEP 2
// Normalisasi SAW
// ==========================================

const normalisasi = perusahaan.map((p) => {

  const nilaiNormalisasi = p.nilaiKriteria.map((nilai) => {

    const stat = statistik[nilai.kriteriaId];

    let hasil = 0;

    // BENEFIT
    if (stat && stat.tipe === "BENEFIT") {

      hasil = nilai.nilaiSkala / stat.max;

    }

    // COST
    else if (stat) {

      hasil = stat.min / nilai.nilaiSkala;

    }

    return {
      kriteriaId: nilai.kriteriaId,
      namaKriteria: nilai.kriteria.nama,
      nilaiAsli: nilai.nilaiSkala,
      normalisasi: Number(hasil.toFixed(4)),
    };

  });

  return {
    perusahaanId: p.id,
    nama: p.nama,
    nilai: nilaiNormalisasi,
  };

});

console.log(JSON.stringify(normalisasi, null, 2));

// ==========================================
// STEP 3
// Hitung Nilai Preferensi SAW
// ==========================================

const hasilSaw = normalisasi.map((item) => {

  let total = 0;

  item.nilai.forEach((nilai) => {

    const bobotItem = bobot.find(
      (b: any) => Number(b.kriteriaId) === nilai.kriteriaId
    );

    if (bobotItem) {
      total += nilai.normalisasi * Number(bobotItem.bobot);
    }

  });

  return {
    perusahaanId: item.perusahaanId,
    nama: item.nama,
    nilaiAkhir: Number(total.toFixed(4)),
  };

});

console.log("HASIL SAW");
console.log(JSON.stringify(hasilSaw, null, 2));

// ==========================================
// STEP 4
// Ranking
// ==========================================

hasilSaw.sort((a, b) => b.nilaiAkhir - a.nilaiAkhir);

const ranking = hasilSaw.map((item, index) => ({
  ...item,
  ranking: index + 1,
}));

console.log("RANKING");
console.log(JSON.stringify(ranking, null, 2));

// ==========================================
// STEP 5
// Simpan hasil rekomendasi
// ==========================================

await prisma.hasilRekomendasi.createMany({
  data: ranking.map((item) => ({
    rekomendasiId: rekomendasi.id,
    perusahaanId: item.perusahaanId,
    nilai: item.nilaiAkhir,
    ranking: item.ranking,
  })),
});


    // ===========================
    // Response sementara
    // ===========================
    return res.status(201).json({
    message: "Rekomendasi berhasil dihitung",
    rekomendasiId: rekomendasi.id,
    jumlahPerusahaan: ranking.length,
    hasil: ranking,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "Gagal membuat rekomendasi",
      error,
    });

  }
};
    /**
 * =====================================
 * GET HASIL REKOMENDASI
 * =====================================
 */
export const getHasilRekomendasi = async (
  req: Request,
  res: Response
) => {
  try {

    const rekomendasiId = Number(req.params.id);

    const data = await prisma.hasilRekomendasi.findMany({
      where: {
        rekomendasiId,
      },
      include: {
        perusahaan: {
          include: {
            kampus: true,
            bidang: true,
            ratings: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        ranking: "asc",
      },
    });

    return res.status(200).json(data);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "Gagal mengambil hasil rekomendasi",
      error,
    });

  }
};
    
