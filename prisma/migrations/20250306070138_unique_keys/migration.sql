/*
  Warnings:

  - A unique constraint covering the columns `[id,username,email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `User_id_email_key` ON `user`;

-- CreateIndex
CREATE UNIQUE INDEX `User_id_username_email_key` ON `User`(`id`, `username`, `email`);
