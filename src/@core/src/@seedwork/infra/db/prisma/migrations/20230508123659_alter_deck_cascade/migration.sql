-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_decks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "main_card_id" TEXT DEFAULT '',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "decks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "decks_main_card_id_fkey" FOREIGN KEY ("main_card_id") REFERENCES "cards" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_decks" ("created_at", "id", "main_card_id", "name", "updated_at", "user_id") SELECT "created_at", "id", "main_card_id", "name", "updated_at", "user_id" FROM "decks";
DROP TABLE "decks";
ALTER TABLE "new_decks" RENAME TO "decks";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
