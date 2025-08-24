-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Request" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "miles" INTEGER NOT NULL,
    "flightCode" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "requestorId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'reviewing',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Request_requestorId_fkey" FOREIGN KEY ("requestorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Request" ("createdAt", "flightCode", "from", "id", "miles", "requestorId", "to", "type") SELECT "createdAt", "flightCode", "from", "id", "miles", "requestorId", "to", "type" FROM "Request";
DROP TABLE "Request";
ALTER TABLE "new_Request" RENAME TO "Request";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
