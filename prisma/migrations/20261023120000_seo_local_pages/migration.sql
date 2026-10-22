-- AlterTable
ALTER TABLE "Page" ADD COLUMN "ogImage" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN "ogImage" TEXT;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN "ogImage" TEXT;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN "ogImage" TEXT;

-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN "addressLocality" TEXT NOT NULL DEFAULT 'Hyderabad',
ADD COLUMN "addressRegion" TEXT NOT NULL DEFAULT 'Telangana',
ADD COLUMN "postalCode" TEXT NOT NULL DEFAULT '500033',
ADD COLUMN "addressCountry" TEXT NOT NULL DEFAULT 'IN',
ADD COLUMN "priceRange" TEXT,
ADD COLUMN "openingHours" TEXT[] DEFAULT ARRAY['Monday-Saturday|10:00-18:00', 'Sunday|Closed']::TEXT[],
ADD COLUMN "googleMapsUrl" TEXT,
ADD COLUMN "googleBusinessProfileUrl" TEXT;

-- Normalize the demo address into street-only data for the seeded settings row.
UPDATE "SiteSettings"
SET "address" = '12A, Road No. 36, Jubilee Hills'
WHERE "address" = 'Jubilee Hills, Hyderabad, Telangana 500033';

-- CreateTable
CREATE TABLE "LocationPage" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "region" TEXT,
    "title" TEXT NOT NULL,
    "intro" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT,
    "ogImage" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LocationPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Redirect" (
    "id" TEXT NOT NULL,
    "fromPath" TEXT NOT NULL,
    "toPath" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL DEFAULT 308,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Redirect_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LocationPage_slug_key" ON "LocationPage"("slug");

-- CreateIndex
CREATE INDEX "LocationPage_published_sortOrder_idx" ON "LocationPage"("published", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Redirect_fromPath_key" ON "Redirect"("fromPath");

-- CreateIndex
CREATE INDEX "Redirect_toPath_idx" ON "Redirect"("toPath");
