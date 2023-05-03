-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_deck_cards" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "deck_id" TEXT NOT NULL,
    "card_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "deck_cards_deck_id_fkey" FOREIGN KEY ("deck_id") REFERENCES "decks" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "deck_cards_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "Card" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_deck_cards" ("card_id", "created_at", "deck_id", "id", "updated_at") SELECT "card_id", "created_at", "deck_id", "id", "updated_at" FROM "deck_cards";
DROP TABLE "deck_cards";
ALTER TABLE "new_deck_cards" RENAME TO "deck_cards";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
