-- Run once against an existing PostgreSQL database before deploying code that
-- reads WardrobeItem.timesWorn/lastWorn. Fresh databases use `pnpm database`.
BEGIN;

ALTER TABLE "WardrobeItem"
  ADD COLUMN "timesWorn" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "lastWorn" TIMESTAMP(3);

UPDATE "WardrobeItem" AS wardrobe
SET "timesWorn" = clothing."timesWorn",
    "lastWorn" = clothing."lastWorn"
FROM "ClothingItem" AS clothing
WHERE wardrobe."clothingItemId" = clothing."id";

ALTER TABLE "ClothingItem"
  DROP COLUMN "timesWorn",
  DROP COLUMN "lastWorn";

COMMIT;
