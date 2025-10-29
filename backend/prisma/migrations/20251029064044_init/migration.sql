/*
  Warnings:

  - You are about to drop the column `forgotPasswordExpiry` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `forgotPasswordToken` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `refreshTokenExpiry` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "forgotPasswordExpiry",
DROP COLUMN "forgotPasswordToken",
DROP COLUMN "refreshToken",
DROP COLUMN "refreshTokenExpiry";
