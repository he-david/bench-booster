-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Seniority" AS ENUM ('A1', 'A2', 'A3', 'A4', 'A5', 'B1', 'B2', 'B3', 'B4');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "client" TEXT NOT NULL,
    "technology" TEXT NOT NULL,
    "skillCategory" TEXT NOT NULL,
    "seniority" "Seniority" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionRating" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "cameUp" BOOLEAN NOT NULL DEFAULT false,
    "cameUpDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionRating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionRating_questionId_key" ON "QuestionRating"("questionId");

-- AddForeignKey
ALTER TABLE "QuestionRating" ADD CONSTRAINT "QuestionRating_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
