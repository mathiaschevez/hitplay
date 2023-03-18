/*
  Warnings:

  - You are about to drop the `Playlist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vote` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `playlistId` on the `Track` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Playlist";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Vote";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Duel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "track1Id" TEXT NOT NULL,
    "track2Id" TEXT NOT NULL,
    "winnerId" TEXT,
    "loserId" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Duel_track1Id_fkey" FOREIGN KEY ("track1Id") REFERENCES "Track" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Duel_track2Id_fkey" FOREIGN KEY ("track2Id") REFERENCES "Track" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Duel_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "Track" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Duel_loserId_fkey" FOREIGN KEY ("loserId") REFERENCES "Track" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Duel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Track" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "previewURL" TEXT NOT NULL
);
INSERT INTO "new_Track" ("createdAt", "id", "imageUrl", "name", "previewURL") SELECT "createdAt", "id", "imageUrl", "name", "previewURL" FROM "Track";
DROP TABLE "Track";
ALTER TABLE "new_Track" RENAME TO "Track";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
