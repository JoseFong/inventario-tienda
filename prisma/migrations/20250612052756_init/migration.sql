-- CreateTable
CREATE TABLE "Customer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "rfc" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Movement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "changeInMoney" REAL NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "customerId" INTEGER,
    CONSTRAINT "Movement_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Movement" ("changeInMoney", "date", "id", "time", "type") SELECT "changeInMoney", "date", "id", "time", "type" FROM "Movement";
DROP TABLE "Movement";
ALTER TABLE "new_Movement" RENAME TO "Movement";
CREATE TABLE "new_MovementProduct" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "quantity" INTEGER NOT NULL,
    "productId" INTEGER,
    "movementId" INTEGER NOT NULL,
    "variationId" INTEGER,
    CONSTRAINT "MovementProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "MovementProduct_movementId_fkey" FOREIGN KEY ("movementId") REFERENCES "Movement" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MovementProduct_variationId_fkey" FOREIGN KEY ("variationId") REFERENCES "Variation" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_MovementProduct" ("id", "movementId", "productId", "quantity", "variationId") SELECT "id", "movementId", "productId", "quantity", "variationId" FROM "MovementProduct";
DROP TABLE "MovementProduct";
ALTER TABLE "new_MovementProduct" RENAME TO "MovementProduct";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
