/*
  Warnings:

  - You are about to drop the column `dueDate` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "task" DROP COLUMN "dueDate",
DROP COLUMN "status";
