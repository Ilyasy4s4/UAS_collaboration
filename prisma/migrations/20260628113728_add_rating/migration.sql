-- CreateTable
CREATE TABLE `rating` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `perusahaan_id` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL,
    `review` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `rating_user_id_idx`(`user_id`),
    INDEX `rating_perusahaan_id_idx`(`perusahaan_id`),
    UNIQUE INDEX `rating_user_id_perusahaan_id_key`(`user_id`, `perusahaan_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `rating` ADD CONSTRAINT `rating_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rating` ADD CONSTRAINT `rating_perusahaan_id_fkey` FOREIGN KEY (`perusahaan_id`) REFERENCES `perusahaan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
