-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT NOT NULL,
    "story" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "year" TEXT,
    "coverImage" TEXT NOT NULL,
    "beforeImage" TEXT,
    "afterImage" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "ProjectImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "specifications" TEXT,
    "price" INTEGER,
    "priceOnRequest" BOOLEAN NOT NULL DEFAULT true,
    "material" TEXT,
    "dimensions" TEXT,
    "color" TEXT,
    "leadTime" TEXT,
    "coverImage" TEXT NOT NULL,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "productId" TEXT NOT NULL,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "location" TEXT,
    "project" TEXT,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faq" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Faq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "showInFooter" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inquiry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "message" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'contact',
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "notes" TEXT,
    "productId" TEXT,
    "serviceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'site',
    "businessName" TEXT NOT NULL DEFAULT 'Ivory & Oak',
    "tagline" TEXT NOT NULL DEFAULT 'Interiors with soul',
    "logoImage" TEXT,
    "faviconUrl" TEXT,
    "phone" TEXT NOT NULL DEFAULT '+91 98490 22118',
    "email" TEXT NOT NULL DEFAULT 'studio@ivoryandoak.in',
    "whatsapp" TEXT NOT NULL DEFAULT '919849022118',
    "address" TEXT NOT NULL DEFAULT 'Jubilee Hills, Hyderabad, Telangana 500033',
    "serviceAreas" TEXT[] DEFAULT ARRAY['Hyderabad', 'Bengaluru', 'Vijayawada']::TEXT[],
    "instagram" TEXT,
    "pinterest" TEXT,
    "googleMapsEmbedUrl" TEXT,
    "announcementEnabled" BOOLEAN NOT NULL DEFAULT false,
    "announcementText" TEXT,
    "announcementHref" TEXT,
    "heroEyebrow" TEXT NOT NULL DEFAULT 'Interior design studio - Hyderabad',
    "heroTitle" TEXT NOT NULL DEFAULT 'A home that feels like a deep breath.',
    "heroDescription" TEXT NOT NULL DEFAULT 'Thoughtful, layered interiors for people who value the quiet luxury of home. We design spaces that hold your everyday life beautifully.',
    "heroImage" TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=85',
    "aboutStory" TEXT NOT NULL,
    "philosophy" TEXT NOT NULL,
    "aboutImage" TEXT NOT NULL,
    "founderName" TEXT NOT NULL DEFAULT 'Ananya Rao',
    "founderRole" TEXT NOT NULL DEFAULT 'Founder & Principal Designer',
    "founderImage" TEXT,
    "yearsExperience" INTEGER NOT NULL DEFAULT 12,
    "projectsCompleted" INTEGER NOT NULL DEFAULT 180,
    "citiesServed" INTEGER NOT NULL DEFAULT 6,
    "values" JSONB NOT NULL,
    "team" JSONB NOT NULL,
    "whyChooseUs" JSONB NOT NULL,
    "homeProjectsEyebrow" TEXT NOT NULL DEFAULT 'Selected work',
    "homeProjectsTitle" TEXT NOT NULL DEFAULT 'Spaces with a sense of
quiet permanence.',
    "homeProjectsDescription" TEXT NOT NULL DEFAULT 'A selection of homes and workspaces shaped around the people who live and work in them.',
    "homeServicesEyebrow" TEXT NOT NULL DEFAULT 'What we do',
    "homeServicesTitle" TEXT NOT NULL DEFAULT 'From the first
sketch to the final
cushion.',
    "homeServicesDescription" TEXT NOT NULL DEFAULT 'A full-service studio for residential and commercial interiors, with every detail handled under one roof.',
    "homeProductsEyebrow" TEXT NOT NULL DEFAULT 'The collection',
    "homeProductsTitle" TEXT NOT NULL DEFAULT 'Objects that make
a house feel yours.',
    "homeProductsDescription" TEXT NOT NULL DEFAULT 'A considered collection of furniture, lighting, textiles, and objects - made in small batches by craftspeople we trust.',
    "homeWhyEyebrow" TEXT NOT NULL DEFAULT 'Why Ivory & Oak',
    "homeWhyTitle" TEXT NOT NULL DEFAULT 'A studio built on
trust and detail.',
    "homeWhyDescription" TEXT NOT NULL DEFAULT 'We keep our projects limited so every home gets the attention it deserves. That means a small, senior team and one accountable point of contact.',
    "homeTestimonialsEyebrow" TEXT NOT NULL DEFAULT 'In their words',
    "homeTestimonialsTitle" TEXT NOT NULL DEFAULT 'Good homes.
Genuine people.',
    "homeCtaEyebrow" TEXT NOT NULL DEFAULT 'Begin a project',
    "homeCtaTitle" TEXT NOT NULL DEFAULT 'Let''s design a home you''ll never want to leave.',
    "homeCtaDescription" TEXT NOT NULL DEFAULT 'Tell us about your space, your routines, and what you''re dreaming of. We''ll take it from there.',
    "homeCtaImage" TEXT,
    "footerDescription" TEXT NOT NULL DEFAULT 'A Hyderabad-based interior design studio creating thoughtful, layered spaces across South India.',
    "footerNote" TEXT,
    "seoTitle" TEXT NOT NULL DEFAULT 'Ivory & Oak | Interior Design Studio, Hyderabad',
    "seoDescription" TEXT NOT NULL DEFAULT 'Thoughtful, layered interiors for homes and workspaces across Hyderabad and South India. Residential interiors, modular kitchens, wardrobes and commercial design.',
    "seoKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ogImage" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_published_sortOrder_idx" ON "Category"("published", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- CreateIndex
CREATE INDEX "Service_published_sortOrder_idx" ON "Service"("published", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "Project_published_featured_sortOrder_idx" ON "Project"("published", "featured", "sortOrder");

-- CreateIndex
CREATE INDEX "Project_category_published_idx" ON "Project"("category", "published");

-- CreateIndex
CREATE INDEX "ProjectImage_projectId_sortOrder_idx" ON "ProjectImage"("projectId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "Product_categoryId_published_sortOrder_idx" ON "Product"("categoryId", "published", "sortOrder");

-- CreateIndex
CREATE INDEX "Product_published_featured_idx" ON "Product"("published", "featured");

-- CreateIndex
CREATE INDEX "ProductImage_productId_sortOrder_idx" ON "ProductImage"("productId", "sortOrder");

-- CreateIndex
CREATE INDEX "Testimonial_published_sortOrder_idx" ON "Testimonial"("published", "sortOrder");

-- CreateIndex
CREATE INDEX "Faq_published_sortOrder_idx" ON "Faq"("published", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");

-- CreateIndex
CREATE INDEX "Page_published_showInFooter_sortOrder_idx" ON "Page"("published", "showInFooter", "sortOrder");

-- CreateIndex
CREATE INDEX "Inquiry_status_createdAt_idx" ON "Inquiry"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Inquiry_name_idx" ON "Inquiry"("name");

-- AddForeignKey
ALTER TABLE "ProjectImage" ADD CONSTRAINT "ProjectImage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

