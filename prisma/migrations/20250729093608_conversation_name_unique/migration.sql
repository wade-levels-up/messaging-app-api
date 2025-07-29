/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.
  - Made the column `name` on table `Conversation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Conversation" ALTER COLUMN "name" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_name_key" ON "Conversation"("name");
