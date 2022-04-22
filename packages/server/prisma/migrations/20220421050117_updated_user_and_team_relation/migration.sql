/*
  Warnings:

  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `identityCardNumber` on the `User` table. The data in that column will be cast from `String` to `String`. This cast may fail. Please make sure the data in the column can be cast.
  - A unique constraint covering the columns `[leaderId]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `leaderId` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startingPoint` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Station" AS ENUM ('CHAOSARENA', 'INFINITYCITY', 'BLACKMARKET', 'LOSTZONE');

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "leaderId" TEXT NOT NULL;
ALTER TABLE "Team" ADD COLUMN     "startingPoint" "Station" NOT NULL;
ALTER TABLE "Team" ADD COLUMN     "tgOneCompleted" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Team" ADD COLUMN     "tgThreeCompleted" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Team" ADD COLUMN     "tgTwoCompleted" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Team" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "Team" ALTER COLUMN "points" SET DEFAULT 0;
DROP SEQUENCE "Team_id_seq";

-- RedefineTables
CREATE TABLE "_prisma_new_User" (
    "identityCardNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "birthYear" INT4 NOT NULL,
    "gender" "Gender" NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "satellite" "Satellite" NOT NULL,
    "cg" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "shirtSize" "ShirtSize" NOT NULL,
    "teamId" INT4,

    CONSTRAINT "User_pkey" PRIMARY KEY ("identityCardNumber")
);
DROP INDEX "User_identityCardNumber_key";
INSERT INTO "_prisma_new_User" ("birthYear","cg","contactNumber","createdAt","gender","identityCardNumber","satellite","shirtSize","status","teamId","updatedAt") SELECT "birthYear","cg","contactNumber","createdAt","gender","identityCardNumber","satellite","shirtSize","status","teamId","updatedAt" FROM "User";
DROP TABLE "User" CASCADE;
ALTER TABLE "_prisma_new_User" RENAME TO "User";
ALTER TABLE "User" ADD CONSTRAINT "User_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE UNIQUE INDEX "Team_leaderId_key" ON "Team"("leaderId");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "User"("identityCardNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
