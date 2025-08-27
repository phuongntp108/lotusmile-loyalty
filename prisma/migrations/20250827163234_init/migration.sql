-- CreateEnum
CREATE TYPE "public"."RequestStatus" AS ENUM ('reviewing', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "ssm_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Request" (
    "id" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "miles" INTEGER NOT NULL,
    "flightCode" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "requestorId" TEXT NOT NULL,
    "status" "public"."RequestStatus" NOT NULL DEFAULT 'reviewing',
    "baseMiles" INTEGER NOT NULL DEFAULT 0,
    "bonusMiles" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_ssm_id_key" ON "public"."User"("ssm_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."Request" ADD CONSTRAINT "Request_requestorId_fkey" FOREIGN KEY ("requestorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
