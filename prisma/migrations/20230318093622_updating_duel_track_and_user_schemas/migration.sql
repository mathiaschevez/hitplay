-- CreateTable
CREATE TABLE "_SeenBy" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_SeenBy_A_fkey" FOREIGN KEY ("A") REFERENCES "Duel" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_SeenBy_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Duel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "track1Id" TEXT NOT NULL,
    "track2Id" TEXT NOT NULL,
    "winnerId" TEXT,
    "loserId" TEXT,
    CONSTRAINT "Duel_track1Id_fkey" FOREIGN KEY ("track1Id") REFERENCES "Track" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Duel_track2Id_fkey" FOREIGN KEY ("track2Id") REFERENCES "Track" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Duel_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "Track" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Duel_loserId_fkey" FOREIGN KEY ("loserId") REFERENCES "Track" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Duel" ("createdAt", "id", "loserId", "track1Id", "track2Id", "userId", "winnerId") SELECT "createdAt", "id", "loserId", "track1Id", "track2Id", "userId", "winnerId" FROM "Duel";
DROP TABLE "Duel";
ALTER TABLE "new_Duel" RENAME TO "Duel";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_SeenBy_AB_unique" ON "_SeenBy"("A", "B");

-- CreateIndex
CREATE INDEX "_SeenBy_B_index" ON "_SeenBy"("B");
