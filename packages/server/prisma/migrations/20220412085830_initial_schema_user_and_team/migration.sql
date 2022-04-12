-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "Satellite" AS ENUM ('KUCHAI', 'KEPONG', 'PJ', 'PUCHONG', 'RAWANG', 'SERDANG', 'SEREMBAN', 'SETAPAK', 'SGLONG', 'USJ', 'KLANG', 'KAJNG');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('NEWFRIEND', 'NEWBELIEVER', 'ORDINARYMEMBER', 'LEADER', 'BOSSLEVEL');

-- CreateEnum
CREATE TYPE "ShirtSize" AS ENUM ('XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL4 NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "identityCardNumber" VARCHAR(12) NOT NULL,
    "birthYear" INT4 NOT NULL,
    "gender" "Gender" NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "satellite" "Satellite" NOT NULL,
    "cg" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "shirtSize" "ShirtSize" NOT NULL,
    "teamId" INT4,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL4 NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "points" INT4 NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_identityCardNumber_key" ON "User"("identityCardNumber");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
