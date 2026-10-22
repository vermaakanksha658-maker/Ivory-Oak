import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  demoFaqs,
  demoLocationPages,
  demoPages,
  demoProducts,
  demoProjects,
  demoServices,
  demoSettings,
  demoTestimonials,
} from "../src/lib/demo-data";
import { slugify } from "../src/lib/utils";

const prisma = new PrismaClient();

function json(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@ivoryandoak.in")
    .trim()
    .toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? "Studio Admin";

  if (!password || password.length < 8) {
    throw new Error(
      "Set ADMIN_PASSWORD (at least 8 characters) before running the seed. " +
        "Add it to .env or pass it inline.",
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { email },
    create: { email, name, passwordHash },
    update: { name, passwordHash },
  });

  console.log(`Admin ready: ${email}`);
}

async function seedSettings() {
  const data = {
    ...demoSettings,
    values: json(demoSettings.values),
    team: json(demoSettings.team),
    whyChooseUs: json(demoSettings.whyChooseUs),
  };

  await prisma.siteSettings.upsert({
    where: { id: "site" },
    create: { id: "site", ...data },
    update: data,
  });

  console.log("Site content ready.");
}

async function seedCategories() {
  const names = Array.from(
    new Set(demoProducts.map((product) => product.category)),
  );
  const categories = new Map<string, string>();

  for (const [index, name] of names.entries()) {
    const slug = slugify(name);
    const category = await prisma.category.upsert({
      where: { slug },
      create: {
        slug,
        name,
        published: true,
        sortOrder: index + 1,
      },
      update: { name, published: true },
    });
    categories.set(name, category.id);
  }

  console.log(`${names.length} categories ready.`);
  return categories;
}

async function seedServices() {
  for (const [index, service] of demoServices.entries()) {
    const data = {
      title: service.title,
      shortDescription: service.shortDescription,
      description: service.description,
      image: service.image,
      ogImage: service.ogImage ?? null,
      seoTitle: service.seoTitle ?? null,
      seoDescription: service.seoDescription ?? null,
      published: service.published,
      sortOrder: index + 1,
    };

    await prisma.service.upsert({
      where: { slug: service.slug },
      create: { slug: service.slug, ...data },
      update: data,
    });
  }

  console.log(`${demoServices.length} services ready.`);
}

async function seedProjects() {
  for (const [index, project] of demoProjects.entries()) {
    const images = project.images.map((image, imageIndex) => ({
      url: image.url,
      alt: image.alt,
      sortOrder: imageIndex,
    }));

    const data = {
      title: project.title,
      subtitle: project.subtitle,
      description: project.description,
      story: project.story,
      category: project.category,
      location: project.location,
      style: project.style,
      year: project.year,
      coverImage: project.coverImage,
      beforeImage: project.beforeImage,
      afterImage: project.afterImage,
      ogImage: project.ogImage ?? null,
      seoTitle: project.seoTitle ?? null,
      seoDescription: project.seoDescription ?? null,
      featured: project.featured,
      published: project.published,
      sortOrder: index + 1,
    };

    const existing = await prisma.project.findUnique({
      where: { slug: project.slug },
      select: { id: true },
    });

    if (existing) {
      await prisma.project.update({
        where: { id: existing.id },
        data: {
          ...data,
          images: { deleteMany: {}, create: images },
        },
      });
    } else {
      await prisma.project.create({
        data: {
          slug: project.slug,
          ...data,
          images: { create: images },
        },
      });
    }
  }

  console.log(`${demoProjects.length} projects ready.`);
}

async function seedProducts(categories: Map<string, string>) {
  for (const [index, product] of demoProducts.entries()) {
    const images = product.images.map((image, imageIndex) => ({
      url: image.url,
      alt: image.alt,
      sortOrder: imageIndex,
    }));

    const categoryId = categories.get(product.category);

    if (!categoryId) {
      throw new Error(`Missing category for product: ${product.name}`);
    }

    const data = {
      name: product.name,
      categoryId,
      description: product.description,
      specifications: product.specifications ?? null,
      price: product.price,
      priceOnRequest: product.priceOnRequest,
      material: product.material,
      dimensions: product.dimensions,
      color: product.color,
      leadTime: product.leadTime,
      coverImage: product.coverImage,
      ogImage: product.ogImage ?? null,
      seoTitle: product.seoTitle ?? null,
      seoDescription: product.seoDescription ?? null,
      featured: product.featured,
      published: product.published,
      sortOrder: index + 1,
    };

    const existing = await prisma.product.findUnique({
      where: { slug: product.slug },
      select: { id: true },
    });

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          ...data,
          images: { deleteMany: {}, create: images },
        },
      });
    } else {
      await prisma.product.create({
        data: {
          slug: product.slug,
          ...data,
          images: { create: images },
        },
      });
    }
  }

  console.log(`${demoProducts.length} products ready.`);
}

async function seedTestimonials() {
  await prisma.testimonial.deleteMany({
    where: {
      name: { in: demoTestimonials.map((testimonial) => testimonial.name) },
    },
  });

  await prisma.testimonial.createMany({
    data: demoTestimonials.map((testimonial, index) => ({
      name: testimonial.name,
      quote: testimonial.quote,
      location: testimonial.location,
      project: testimonial.project,
      rating: testimonial.rating,
      published: testimonial.published,
      sortOrder: index + 1,
    })),
  });

  console.log(`${demoTestimonials.length} testimonials ready.`);
}

async function seedFaqs() {
  await prisma.faq.deleteMany();
  await prisma.faq.createMany({
    data: demoFaqs.map((faq, index) => ({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      published: faq.published,
      sortOrder: index + 1,
    })),
  });

  console.log(`${demoFaqs.length} FAQs ready.`);
}

async function seedPages() {
  for (const [index, page] of demoPages.entries()) {
    const data = {
      title: page.title,
      excerpt: page.excerpt,
      content: page.content,
      ogImage: page.ogImage ?? null,
      seoTitle: page.seoTitle,
      seoDescription: page.seoDescription,
      published: page.published,
      showInFooter: page.showInFooter,
      sortOrder: index + 1,
    };

    await prisma.page.upsert({
      where: { slug: page.slug },
      create: { slug: page.slug, ...data },
      update: data,
    });
  }

  console.log(`${demoPages.length} pages ready.`);
}

async function seedLocationPages() {
  for (const [index, location] of demoLocationPages.entries()) {
    const data = {
      city: location.city,
      region: location.region,
      title: location.title,
      intro: location.intro,
      content: location.content,
      image: location.image,
      ogImage: location.ogImage ?? null,
      seoTitle: location.seoTitle,
      seoDescription: location.seoDescription,
      published: location.published,
      sortOrder: index + 1,
    };

    await prisma.locationPage.upsert({
      where: { slug: location.slug },
      create: { slug: location.slug, ...data },
      update: data,
    });
  }

  console.log(`${demoLocationPages.length} location pages ready.`);
}

async function main() {
  await seedAdmin();
  await seedSettings();
  const categories = await seedCategories();
  await seedServices();
  await seedProjects();
  await seedProducts(categories);
  await seedTestimonials();
  await seedFaqs();
  await seedPages();
  await seedLocationPages();
  console.log("\nSeed complete.");
}

main()
  .catch((error) => {
    console.error("\nSeed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
