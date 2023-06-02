-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "host_id" TEXT NOT NULL,
    "participant_id" TEXT,
    CONSTRAINT "Match_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Match_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Match_host_id_key" ON "Match"("host_id");

-- CreateIndex
CREATE UNIQUE INDEX "Match_participant_id_key" ON "Match"("participant_id");
