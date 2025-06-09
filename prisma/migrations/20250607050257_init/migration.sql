-- CreateTable
CREATE TABLE "Token" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "permits" TEXT NOT NULL
);
