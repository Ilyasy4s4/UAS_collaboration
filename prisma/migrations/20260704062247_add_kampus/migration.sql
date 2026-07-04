-- AlterTable
ALTER TABLE `users` ADD COLUMN `kampus_id` INTEGER NULL,
    MODIFY `role` ENUM('ADMIN', 'MAHASISWA', 'SUPER_ADMIN') NOT NULL;

-- CreateTable
CREATE TABLE `kampus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `alamat` VARCHAR(191) NULL,
    `kota` VARCHAR(191) NULL,
    `logo` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `kampus_nama_key`(`nama`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `users_kampus_id_idx` ON `users`(`kampus_id`);

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_kampus_id_fkey` FOREIGN KEY (`kampus_id`) REFERENCES `kampus`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
