-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'MAHASISWA') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bidang` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `deskripsi` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `perusahaan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `deskripsi` VARCHAR(191) NULL,
    `alamat` VARCHAR(191) NOT NULL,
    `kota` VARCHAR(191) NOT NULL,
    `mode_kerja` ENUM('WFO', 'WFH', 'HYBRID', 'REMOTE') NOT NULL,
    `image` VARCHAR(191) NULL,
    `bidang_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `perusahaan_kota_idx`(`kota`),
    INDEX `perusahaan_mode_kerja_idx`(`mode_kerja`),
    INDEX `perusahaan_bidang_id_idx`(`bidang_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kriteria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kode` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `tipe` ENUM('BENEFIT', 'COST') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `kriteria_kode_key`(`kode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `nilai_kriteria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `perusahaan_id` INTEGER NOT NULL,
    `kriteria_id` INTEGER NOT NULL,
    `nilai_skala` INTEGER NOT NULL,

    UNIQUE INDEX `nilai_kriteria_perusahaan_id_kriteria_id_key`(`perusahaan_id`, `kriteria_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rekomendasi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `bidang_id` INTEGER NOT NULL,
    `kota_filter` VARCHAR(191) NOT NULL,
    `mode_filter` ENUM('WFO', 'WFH', 'HYBRID', 'REMOTE') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bobot_rekomendasi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rekomendasi_id` INTEGER NOT NULL,
    `kriteria_id` INTEGER NOT NULL,
    `bobot` DOUBLE NOT NULL,

    UNIQUE INDEX `bobot_rekomendasi_rekomendasi_id_kriteria_id_key`(`rekomendasi_id`, `kriteria_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hasil_rekomendasi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rekomendasi_id` INTEGER NOT NULL,
    `perusahaan_id` INTEGER NOT NULL,
    `nilai` DOUBLE NOT NULL,
    `ranking` INTEGER NOT NULL,

    UNIQUE INDEX `hasil_rekomendasi_rekomendasi_id_perusahaan_id_key`(`rekomendasi_id`, `perusahaan_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `perusahaan` ADD CONSTRAINT `perusahaan_bidang_id_fkey` FOREIGN KEY (`bidang_id`) REFERENCES `bidang`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nilai_kriteria` ADD CONSTRAINT `nilai_kriteria_perusahaan_id_fkey` FOREIGN KEY (`perusahaan_id`) REFERENCES `perusahaan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nilai_kriteria` ADD CONSTRAINT `nilai_kriteria_kriteria_id_fkey` FOREIGN KEY (`kriteria_id`) REFERENCES `kriteria`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rekomendasi` ADD CONSTRAINT `rekomendasi_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rekomendasi` ADD CONSTRAINT `rekomendasi_bidang_id_fkey` FOREIGN KEY (`bidang_id`) REFERENCES `bidang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bobot_rekomendasi` ADD CONSTRAINT `bobot_rekomendasi_rekomendasi_id_fkey` FOREIGN KEY (`rekomendasi_id`) REFERENCES `rekomendasi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bobot_rekomendasi` ADD CONSTRAINT `bobot_rekomendasi_kriteria_id_fkey` FOREIGN KEY (`kriteria_id`) REFERENCES `kriteria`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hasil_rekomendasi` ADD CONSTRAINT `hasil_rekomendasi_rekomendasi_id_fkey` FOREIGN KEY (`rekomendasi_id`) REFERENCES `rekomendasi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hasil_rekomendasi` ADD CONSTRAINT `hasil_rekomendasi_perusahaan_id_fkey` FOREIGN KEY (`perusahaan_id`) REFERENCES `perusahaan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
