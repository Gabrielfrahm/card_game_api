/*
  Warnings:

  - Added the required column `status` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Match" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "host_id" TEXT NOT NULL,
    "participant_id" TEXT,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Match_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Match_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Match" ("host_id", "id", "participant_id") SELECT "host_id", "id", "participant_id" FROM "Match";
DROP TABLE "Match";
ALTER TABLE "new_Match" RENAME TO "Match";
CREATE UNIQUE INDEX "Match_host_id_key" ON "Match"("host_id");
CREATE UNIQUE INDEX "Match_participant_id_key" ON "Match"("participant_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
