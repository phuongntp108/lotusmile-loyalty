-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "miles" INTEGER NOT NULL,
    "flightCode" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "requestorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Request_requestorId_fkey" FOREIGN KEY ("requestorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
