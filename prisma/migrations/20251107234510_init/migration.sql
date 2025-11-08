/*
  Warnings:

  - You are about to drop the `_TeamProperties` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TeamTasks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `checklist_templates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `checklists` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `integrations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `photos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `properties` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `settings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `statistics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subscriptions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `task_notes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tasks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `team_members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `webhook_events` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_TeamProperties" DROP CONSTRAINT "_TeamProperties_A_fkey";

-- DropForeignKey
ALTER TABLE "_TeamProperties" DROP CONSTRAINT "_TeamProperties_B_fkey";

-- DropForeignKey
ALTER TABLE "_TeamTasks" DROP CONSTRAINT "_TeamTasks_A_fkey";

-- DropForeignKey
ALTER TABLE "_TeamTasks" DROP CONSTRAINT "_TeamTasks_B_fkey";

-- DropForeignKey
ALTER TABLE "checklists" DROP CONSTRAINT "checklists_taskId_fkey";

-- DropForeignKey
ALTER TABLE "checklists" DROP CONSTRAINT "checklists_templateId_fkey";

-- DropForeignKey
ALTER TABLE "photos" DROP CONSTRAINT "photos_taskId_fkey";

-- DropForeignKey
ALTER TABLE "photos" DROP CONSTRAINT "photos_userId_fkey";

-- DropForeignKey
ALTER TABLE "task_notes" DROP CONSTRAINT "task_notes_taskId_fkey";

-- DropForeignKey
ALTER TABLE "task_notes" DROP CONSTRAINT "task_notes_userId_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_assignedTo_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_propertyId_fkey";

-- DropTable
DROP TABLE "_TeamProperties";

-- DropTable
DROP TABLE "_TeamTasks";

-- DropTable
DROP TABLE "checklist_templates";

-- DropTable
DROP TABLE "checklists";

-- DropTable
DROP TABLE "integrations";

-- DropTable
DROP TABLE "notifications";

-- DropTable
DROP TABLE "payments";

-- DropTable
DROP TABLE "photos";

-- DropTable
DROP TABLE "properties";

-- DropTable
DROP TABLE "settings";

-- DropTable
DROP TABLE "statistics";

-- DropTable
DROP TABLE "subscriptions";

-- DropTable
DROP TABLE "task_notes";

-- DropTable
DROP TABLE "tasks";

-- DropTable
DROP TABLE "team_members";

-- DropTable
DROP TABLE "users";

-- DropTable
DROP TABLE "webhook_events";

-- DropEnum
DROP TYPE "ChecklistStatus";

-- DropEnum
DROP TYPE "IntegrationStatus";

-- DropEnum
DROP TYPE "IntegrationType";

-- DropEnum
DROP TYPE "NotificationType";

-- DropEnum
DROP TYPE "PaymentStatus";

-- DropEnum
DROP TYPE "PhotoType";

-- DropEnum
DROP TYPE "Priority";

-- DropEnum
DROP TYPE "PropertyType";

-- DropEnum
DROP TYPE "SettingType";

-- DropEnum
DROP TYPE "SubscriptionStatus";

-- DropEnum
DROP TYPE "TaskStatus";

-- DropEnum
DROP TYPE "TaskType";

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'Owner',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
