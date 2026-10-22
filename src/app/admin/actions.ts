"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { destroySession, requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import type { TeamMember, ValueItem } from "@/lib/demo-data";

export type ActionState = {
  error?: string;
};

const RESERVED_PAGE_SLUGS = new Set([
  "about",
  "admin",
  "api",
  "contact",
  "locations",
  "login",
  "portfolio",
  "products",
  "services",
  "sitemap.xml",
  "robots.txt",
]);

function text(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function optionalText(formData: FormData, key: string): string | null {
  const value = text(formData, key);
  return value.length > 0 ? value : null;
}

function numberValue(
  formData: FormData,
  key: string,
  fallback = 0,
): number {
  const value = Number(formData.get(key));
  return Number.isFinite(value) ? value : fallback;
}

function checkbox(formData: FormData, key: string): boolean {
  return formData.get(key) === "on";
}

function parseGallery(raw: string, fallbackAlt: string) {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [url, ...altParts] = line.split("|").map((part) => part.trim());
      return {
        url,
        alt: altParts.join("|") || `${fallbackAlt} — image ${index + 1}`,
        sortOrder: index,
      };
    })
    .filter((image) => image.url.length > 0);
}

function parsePairLines(raw: string): ValueItem[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, ...description] = line.split("|").map((part) => part.trim());
      return { title, description: description.join("|") };
    })
    .filter((item) => item.title && item.description);
}

function parseTeam(raw: string): TeamMember[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, role, bio, image] = line
        .split("|")
        .map((part) => part.trim());
      return { name, role, bio, image };
    })
    .filter((member) => member.name && member.role);
}

function parseList(raw: string): string[] {
  return raw
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseOpeningHours(raw: string): string[] {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [days, ...hours] = line.split("|").map((part) => part.trim());
      return hours.length > 0 ? `${days}|${hours.join("|")}` : days;
    });
}

function invalidUrl(value: string | null): boolean {
  if (!value) return false;
  return !/^(https?:\/\/|\/)/i.test(value);
}

function checkLengths(
  fields: Array<[string, string | null, number]>,
): ActionState | null {
  for (const [label, value, max] of fields) {
    if (value && value.length > max) {
      return { error: `${label} must be ${max} characters or fewer.` };
    }
  }
  return null;
}

async function rememberSlugChange(
  oldPath: string | null,
  newPath: string,
) {
  if (!oldPath || oldPath === newPath) return;

  try {
    await prisma.$transaction([
      prisma.redirect.updateMany({
        where: { toPath: oldPath },
        data: { toPath: newPath },
      }),
      prisma.redirect.deleteMany({ where: { fromPath: newPath } }),
      prisma.redirect.upsert({
        where: { fromPath: oldPath },
        create: { fromPath: oldPath, toPath: newPath, statusCode: 308 },
        update: { toPath: newPath, statusCode: 308 },
      }),
    ]);
  } catch (error) {
    console.error(
      "[ivory-oak] Could not save the old URL redirect. The content itself was saved.",
      error,
    );
  }
}

function refreshPublic(paths: string[] = []) {
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin");
  paths.forEach((path) => revalidatePath(path));
}

function databaseError(error: unknown): ActionState {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    return {
      error:
        "That URL slug is already in use. Please choose a different slug.",
    };
  }

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2003"
  ) {
    return {
      error:
        "A linked item could not be found. Save the category or related item first, then try again.",
    };
  }

  console.error("[ivory-oak] Admin action failed", error);
  return {
    error: "Something went wrong while saving. Please try again.",
  };
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

export async function saveProject(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const id = text(formData, "id");
  const title = text(formData, "title");
  const slug = slugify(text(formData, "slug") || title);
  const description = text(formData, "description");
  const story = text(formData, "story");
  const coverImage = text(formData, "coverImage");

  if (!title || !slug || !description || !story || !coverImage) {
    return {
      error:
        "Title, slug, description, story, and cover image are required.",
    };
  }

  const lengthError = checkLengths([
    ["Title", title, 160],
    ["Description", description, 3000],
    ["Story", story, 20000],
    ["SEO title", optionalText(formData, "seoTitle"), 160],
    ["SEO description", optionalText(formData, "seoDescription"), 320],
  ]);
  if (lengthError) return lengthError;

  const beforeImage = optionalText(formData, "beforeImage");
  const afterImage = optionalText(formData, "afterImage");
  const ogImage = optionalText(formData, "ogImage");
  if (
    invalidUrl(beforeImage) ||
    invalidUrl(afterImage) ||
    invalidUrl(ogImage)
  ) {
    return {
      error: "Before, after, and social sharing image links must be valid URLs.",
    };
  }

  const images = parseGallery(text(formData, "images"), title);
  const data = {
    title,
    slug,
    subtitle: optionalText(formData, "subtitle"),
    description,
    story,
    category: text(formData, "category") || "Residential",
    location: text(formData, "location"),
    style: text(formData, "style"),
    year: optionalText(formData, "year"),
    coverImage,
    beforeImage,
    afterImage,
    ogImage,
    seoTitle: optionalText(formData, "seoTitle"),
    seoDescription: optionalText(formData, "seoDescription"),
    featured: checkbox(formData, "featured"),
    published: checkbox(formData, "published"),
    sortOrder: numberValue(formData, "sortOrder"),
  };

  try {
    if (id) {
      const existing = await prisma.project.findUnique({
        where: { id },
        select: { slug: true },
      });
      await prisma.project.update({
        where: { id },
        data: {
          ...data,
          images: {
            deleteMany: {},
            create: images,
          },
        },
      });
      await rememberSlugChange(
        existing ? `/portfolio/${existing.slug}` : null,
        `/portfolio/${slug}`,
      );
    } else {
      await prisma.project.create({
        data: { ...data, images: { create: images } },
      });
    }
  } catch (error) {
    return databaseError(error);
  }

  refreshPublic(["/portfolio", `/portfolio/${slug}`, "/admin/projects"]);
  redirect("/admin/projects?saved=1");
}

export async function deleteProject(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  if (!id) return;
  await prisma.project.delete({ where: { id } });
  refreshPublic(["/portfolio", "/admin/projects"]);
  redirect("/admin/projects?deleted=1");
}

export async function toggleProject(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) return;
  await prisma.project.update({
    where: { id },
    data: { published: !project.published },
  });
  refreshPublic(["/portfolio", `/portfolio/${project.slug}`, "/admin/projects"]);
}

export async function moveProject(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const direction = text(formData, "direction");
  const items = await prisma.project.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: { id: true },
  });
  const index = items.findIndex((item) => item.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= items.length) return;

  [items[index], items[target]] = [items[target], items[index]];
  await prisma.$transaction(
    items.map((item, order) =>
      prisma.project.update({
        where: { id: item.id },
        data: { sortOrder: order + 1 },
      }),
    ),
  );
  refreshPublic(["/portfolio", "/admin/projects"]);
}

export async function saveService(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const id = text(formData, "id");
  const title = text(formData, "title");
  const slug = slugify(text(formData, "slug") || title);
  const shortDescription = text(formData, "shortDescription");
  const description = text(formData, "description");
  const image = text(formData, "image");
  const ogImage = optionalText(formData, "ogImage");

  if (!title || !slug || !shortDescription || !description || !image) {
    return {
      error:
        "Title, slug, short description, full description, and image are required.",
    };
  }

  if (invalidUrl(ogImage)) {
    return { error: "The social sharing image must use a valid URL." };
  }

  const lengthError = checkLengths([
    ["Title", title, 160],
    ["Short description", shortDescription, 500],
    ["Description", description, 20000],
    ["SEO title", optionalText(formData, "seoTitle"), 160],
    ["SEO description", optionalText(formData, "seoDescription"), 320],
  ]);
  if (lengthError) return lengthError;

  const data = {
    title,
    slug,
    shortDescription,
    description,
    image,
    ogImage,
    seoTitle: optionalText(formData, "seoTitle"),
    seoDescription: optionalText(formData, "seoDescription"),
    published: checkbox(formData, "published"),
    sortOrder: numberValue(formData, "sortOrder"),
  };

  try {
    if (id) {
      const existing = await prisma.service.findUnique({
        where: { id },
        select: { slug: true },
      });
      await prisma.service.update({ where: { id }, data });
      await rememberSlugChange(
        existing ? `/services/${existing.slug}` : null,
        `/services/${slug}`,
      );
    } else {
      await prisma.service.create({ data });
    }
  } catch (error) {
    return databaseError(error);
  }

  refreshPublic(["/services", `/services/${slug}`, "/admin/services"]);
  redirect("/admin/services?saved=1");
}

export async function deleteService(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  if (!id) return;
  await prisma.service.delete({ where: { id } });
  refreshPublic(["/services", "/admin/services"]);
  redirect("/admin/services?deleted=1");
}

export async function toggleService(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) return;
  await prisma.service.update({
    where: { id },
    data: { published: !service.published },
  });
  refreshPublic(["/services", `/services/${service.slug}`, "/admin/services"]);
}

export async function moveService(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const direction = text(formData, "direction");
  const items = await prisma.service.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: { id: true },
  });
  const index = items.findIndex((item) => item.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= items.length) return;

  [items[index], items[target]] = [items[target], items[index]];
  await prisma.$transaction(
    items.map((item, order) =>
      prisma.service.update({
        where: { id: item.id },
        data: { sortOrder: order + 1 },
      }),
    ),
  );
  refreshPublic(["/services", "/admin/services"]);
}

export async function saveCategory(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const id = text(formData, "id");
  const name = text(formData, "name");
  const slug = slugify(text(formData, "slug") || name);

  if (!name || !slug) {
    return { error: "Category name and slug are required." };
  }

  const lengthError = checkLengths([["Category name", name, 100]]);
  if (lengthError) return lengthError;

  const data = {
    name,
    slug,
    published: checkbox(formData, "published"),
    sortOrder: numberValue(formData, "sortOrder"),
  };

  try {
    if (id) {
      await prisma.category.update({ where: { id }, data });
    } else {
      await prisma.category.create({ data });
    }
  } catch (error) {
    return databaseError(error);
  }

  refreshPublic(["/products", "/admin/categories", "/admin/products"]);
  redirect("/admin/categories?saved=1");
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  if (!id) return;
  const inUse = await prisma.product.count({ where: { categoryId: id } });
  if (inUse > 0) {
    redirect("/admin/categories?error=in-use");
  }
  await prisma.category.delete({ where: { id } });
  refreshPublic(["/products", "/admin/categories", "/admin/products"]);
  redirect("/admin/categories?deleted=1");
}

export async function toggleCategory(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) return;
  await prisma.category.update({
    where: { id },
    data: { published: !category.published },
  });
  refreshPublic(["/products", "/admin/categories"]);
}

export async function moveCategory(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const direction = text(formData, "direction");
  const items = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { id: true },
  });
  const index = items.findIndex((item) => item.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= items.length) return;

  [items[index], items[target]] = [items[target], items[index]];
  await prisma.$transaction(
    items.map((item, order) =>
      prisma.category.update({
        where: { id: item.id },
        data: { sortOrder: order + 1 },
      }),
    ),
  );
  refreshPublic(["/products", "/admin/categories"]);
}

export async function saveProduct(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const id = text(formData, "id");
  const name = text(formData, "name");
  const slug = slugify(text(formData, "slug") || name);
  const description = text(formData, "description");
  const coverImage = text(formData, "coverImage");
  const ogImage = optionalText(formData, "ogImage");
  const categoryId = text(formData, "categoryId");
  const priceOnRequest = checkbox(formData, "priceOnRequest");
  const priceRaw = text(formData, "price");
  const price = priceRaw ? Number(priceRaw) : null;

  if (!name || !slug || !description || !coverImage || !categoryId) {
    return {
      error:
        "Name, slug, category, description, and cover image are required.",
    };
  }

  if (invalidUrl(ogImage)) {
    return { error: "The social sharing image must use a valid URL." };
  }

  const lengthError = checkLengths([
    ["Product name", name, 160],
    ["Description", description, 10000],
    ["Specifications", optionalText(formData, "specifications"), 10000],
    ["SEO title", optionalText(formData, "seoTitle"), 160],
    ["SEO description", optionalText(formData, "seoDescription"), 320],
  ]);
  if (lengthError) return lengthError;

  if (!priceOnRequest && (!price || Number.isNaN(price) || price < 0)) {
    return {
      error:
        "Enter a valid price, or mark the product as price on request.",
    };
  }

  const images = parseGallery(text(formData, "images"), name);
  const data = {
    name,
    slug,
    categoryId,
    description,
    specifications: optionalText(formData, "specifications"),
    price: priceOnRequest ? null : Math.round(price ?? 0),
    priceOnRequest,
    material: optionalText(formData, "material"),
    dimensions: optionalText(formData, "dimensions"),
    color: optionalText(formData, "color"),
    leadTime: optionalText(formData, "leadTime"),
    coverImage,
    ogImage,
    seoTitle: optionalText(formData, "seoTitle"),
    seoDescription: optionalText(formData, "seoDescription"),
    featured: checkbox(formData, "featured"),
    published: checkbox(formData, "published"),
    sortOrder: numberValue(formData, "sortOrder"),
  };

  try {
    if (id) {
      const existing = await prisma.product.findUnique({
        where: { id },
        select: { slug: true },
      });
      await prisma.product.update({
        where: { id },
        data: {
          ...data,
          images: {
            deleteMany: {},
            create: images,
          },
        },
      });
      await rememberSlugChange(
        existing ? `/products/${existing.slug}` : null,
        `/products/${slug}`,
      );
    } else {
      await prisma.product.create({
        data: { ...data, images: { create: images } },
      });
    }
  } catch (error) {
    return databaseError(error);
  }

  refreshPublic(["/products", `/products/${slug}`, "/admin/products"]);
  redirect("/admin/products?saved=1");
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  if (!id) return;
  await prisma.product.delete({ where: { id } });
  refreshPublic(["/products", "/admin/products"]);
  redirect("/admin/products?deleted=1");
}

export async function toggleProduct(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return;
  await prisma.product.update({
    where: { id },
    data: { published: !product.published },
  });
  refreshPublic(["/products", `/products/${product.slug}`, "/admin/products"]);
}

export async function moveProduct(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const direction = text(formData, "direction");
  const items = await prisma.product.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: { id: true },
  });
  const index = items.findIndex((item) => item.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= items.length) return;

  [items[index], items[target]] = [items[target], items[index]];
  await prisma.$transaction(
    items.map((item, order) =>
      prisma.product.update({
        where: { id: item.id },
        data: { sortOrder: order + 1 },
      }),
    ),
  );
  refreshPublic(["/products", "/admin/products"]);
}

export async function saveTestimonial(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const id = text(formData, "id");
  const name = text(formData, "name");
  const quote = text(formData, "quote");

  if (!name || !quote) {
    return { error: "Client name and testimonial quote are required." };
  }

  const lengthError = checkLengths([
    ["Client name", name, 120],
    ["Testimonial", quote, 3000],
  ]);
  if (lengthError) return lengthError;

  const data = {
    name,
    quote,
    location: optionalText(formData, "location"),
    project: optionalText(formData, "project"),
    rating: Math.min(5, Math.max(1, numberValue(formData, "rating", 5))),
    published: checkbox(formData, "published"),
    sortOrder: numberValue(formData, "sortOrder"),
  };

  try {
    if (id) {
      await prisma.testimonial.update({ where: { id }, data });
    } else {
      await prisma.testimonial.create({ data });
    }
  } catch (error) {
    return databaseError(error);
  }

  refreshPublic(["/", "/admin/testimonials"]);
  redirect("/admin/testimonials?saved=1");
}

export async function deleteTestimonial(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  if (!id) return;
  await prisma.testimonial.delete({ where: { id } });
  refreshPublic(["/", "/admin/testimonials"]);
  redirect("/admin/testimonials?deleted=1");
}

export async function toggleTestimonial(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) return;
  await prisma.testimonial.update({
    where: { id },
    data: { published: !testimonial.published },
  });
  refreshPublic(["/", "/admin/testimonials"]);
}

export async function saveFaq(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const id = text(formData, "id");
  const question = text(formData, "question");
  const answer = text(formData, "answer");

  if (!question || !answer) {
    return { error: "Question and answer are required." };
  }

  const lengthError = checkLengths([
    ["Question", question, 500],
    ["Answer", answer, 10000],
  ]);
  if (lengthError) return lengthError;

  const data = {
    question,
    answer,
    category: optionalText(formData, "category"),
    published: checkbox(formData, "published"),
    sortOrder: numberValue(formData, "sortOrder"),
  };

  try {
    if (id) {
      await prisma.faq.update({ where: { id }, data });
    } else {
      await prisma.faq.create({ data });
    }
  } catch (error) {
    return databaseError(error);
  }

  refreshPublic(["/contact", "/admin/faqs"]);
  redirect("/admin/faqs?saved=1");
}

export async function deleteFaq(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  if (!id) return;
  await prisma.faq.delete({ where: { id } });
  refreshPublic(["/contact", "/admin/faqs"]);
  redirect("/admin/faqs?deleted=1");
}

export async function toggleFaq(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const faq = await prisma.faq.findUnique({ where: { id } });
  if (!faq) return;
  await prisma.faq.update({
    where: { id },
    data: { published: !faq.published },
  });
  refreshPublic(["/contact", "/admin/faqs"]);
}

export async function moveFaq(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const direction = text(formData, "direction");
  const items = await prisma.faq.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: { id: true },
  });
  const index = items.findIndex((item) => item.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= items.length) return;

  [items[index], items[target]] = [items[target], items[index]];
  await prisma.$transaction(
    items.map((item, order) =>
      prisma.faq.update({
        where: { id: item.id },
        data: { sortOrder: order + 1 },
      }),
    ),
  );
  refreshPublic(["/contact", "/admin/faqs"]);
}

export async function savePage(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const id = text(formData, "id");
  const title = text(formData, "title");
  const slug = slugify(text(formData, "slug") || title);
  const content = text(formData, "content");
  const ogImage = optionalText(formData, "ogImage");

  if (!title || !slug || !content) {
    return { error: "Page title, slug, and content are required." };
  }

  if (invalidUrl(ogImage)) {
    return { error: "The social sharing image must use a valid URL." };
  }

  if (RESERVED_PAGE_SLUGS.has(slug)) {
    return {
      error:
        "That URL is reserved by the website. Please choose a different slug.",
    };
  }

  const lengthError = checkLengths([
    ["Page title", title, 160],
    ["Excerpt", optionalText(formData, "excerpt"), 500],
    ["Content", content, 40000],
    ["SEO title", optionalText(formData, "seoTitle"), 160],
    ["SEO description", optionalText(formData, "seoDescription"), 320],
  ]);
  if (lengthError) return lengthError;

  const data = {
    title,
    slug,
    excerpt: optionalText(formData, "excerpt"),
    content,
    ogImage,
    seoTitle: optionalText(formData, "seoTitle"),
    seoDescription: optionalText(formData, "seoDescription"),
    published: checkbox(formData, "published"),
    showInFooter: checkbox(formData, "showInFooter"),
    sortOrder: numberValue(formData, "sortOrder"),
  };

  try {
    if (id) {
      const existing = await prisma.page.findUnique({
        where: { id },
        select: { slug: true },
      });
      await prisma.page.update({ where: { id }, data });
      await rememberSlugChange(
        existing ? `/${existing.slug}` : null,
        `/${slug}`,
      );
    } else {
      await prisma.page.create({ data });
    }
  } catch (error) {
    return databaseError(error);
  }

  refreshPublic([`/${slug}`, "/admin/pages"]);
  redirect("/admin/pages?saved=1");
}

export async function deletePage(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  if (!id) return;
  const page = await prisma.page.findUnique({ where: { id } });
  await prisma.page.delete({ where: { id } });
  refreshPublic([page ? `/${page.slug}` : "/", "/admin/pages"]);
  redirect("/admin/pages?deleted=1");
}

export async function togglePage(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const page = await prisma.page.findUnique({ where: { id } });
  if (!page) return;
  await prisma.page.update({
    where: { id },
    data: { published: !page.published },
  });
  refreshPublic([`/${page.slug}`, "/admin/pages"]);
}

export async function saveLocationPage(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const id = text(formData, "id");
  const city = text(formData, "city");
  const title = text(formData, "title");
  const slug = slugify(text(formData, "slug") || city);
  const intro = text(formData, "intro");
  const content = text(formData, "content");
  const image = optionalText(formData, "image");
  const ogImage = optionalText(formData, "ogImage");

  if (!city || !title || !slug || !intro || !content) {
    return {
      error:
        "City, page title, slug, introduction, and content are required.",
    };
  }

  if (invalidUrl(image) || invalidUrl(ogImage)) {
    return {
      error: "Location and social sharing images must use valid URLs.",
    };
  }

  const lengthError = checkLengths([
    ["City", city, 120],
    ["Page title", title, 160],
    ["Introduction", intro, 600],
    ["Content", content, 40000],
    ["SEO title", optionalText(formData, "seoTitle"), 160],
    ["SEO description", optionalText(formData, "seoDescription"), 320],
  ]);
  if (lengthError) return lengthError;

  const data = {
    city,
    region: optionalText(formData, "region"),
    title,
    slug,
    intro,
    content,
    image,
    ogImage,
    seoTitle: optionalText(formData, "seoTitle"),
    seoDescription: optionalText(formData, "seoDescription"),
    published: checkbox(formData, "published"),
    sortOrder: numberValue(formData, "sortOrder"),
  };

  try {
    if (id) {
      const existing = await prisma.locationPage.findUnique({
        where: { id },
        select: { slug: true },
      });
      await prisma.locationPage.update({ where: { id }, data });
      await rememberSlugChange(
        existing ? `/locations/${existing.slug}` : null,
        `/locations/${slug}`,
      );
    } else {
      await prisma.locationPage.create({ data });
    }
  } catch (error) {
    return databaseError(error);
  }

  refreshPublic([
    "/locations",
    `/locations/${slug}`,
    "/admin/locations",
  ]);
  redirect("/admin/locations?saved=1");
}

export async function deleteLocationPage(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  if (!id) return;
  const location = await prisma.locationPage.findUnique({ where: { id } });
  await prisma.locationPage.delete({ where: { id } });
  refreshPublic([
    "/locations",
    location ? `/locations/${location.slug}` : "/locations",
    "/admin/locations",
  ]);
  redirect("/admin/locations?deleted=1");
}

export async function toggleLocationPage(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const location = await prisma.locationPage.findUnique({ where: { id } });
  if (!location) return;
  await prisma.locationPage.update({
    where: { id },
    data: { published: !location.published },
  });
  refreshPublic([
    "/locations",
    `/locations/${location.slug}`,
    "/admin/locations",
  ]);
}

export async function saveSettings(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const businessName = text(formData, "businessName");
  const heroTitle = text(formData, "heroTitle");
  const aboutStory = text(formData, "aboutStory");
  const philosophy = text(formData, "philosophy");
  const aboutImage = text(formData, "aboutImage");
  const heroImage = text(formData, "heroImage");

  if (
    !businessName ||
    !heroTitle ||
    !aboutStory ||
    !philosophy ||
    !aboutImage ||
    !heroImage
  ) {
    return {
      error:
        "Business name, hero title, hero image, about story, philosophy, and about image are required.",
    };
  }

  const logoImage = optionalText(formData, "logoImage");
  const faviconUrl = optionalText(formData, "faviconUrl");
  const homeCtaImage = optionalText(formData, "homeCtaImage");
  const ogImage = optionalText(formData, "ogImage");
  const googleMapsEmbedUrl = optionalText(formData, "googleMapsEmbedUrl");
  const googleMapsUrl = optionalText(formData, "googleMapsUrl");
  const googleBusinessProfileUrl = optionalText(
    formData,
    "googleBusinessProfileUrl",
  );
  const invalidUrls = [
    ["Logo", logoImage],
    ["Favicon", faviconUrl],
    ["CTA image", homeCtaImage],
    ["Social sharing image", ogImage],
    ["Google Maps embed", googleMapsEmbedUrl],
    ["Google Maps link", googleMapsUrl],
    ["Google Business Profile", googleBusinessProfileUrl],
  ].filter(([, value]) => invalidUrl(value as string | null));
  if (invalidUrls.length > 0) {
    return {
      error: `${invalidUrls.map(([label]) => label).join(", ")} must use a valid URL.`,
    };
  }

  const lengthError = checkLengths([
    ["Business name", businessName, 120],
    ["SEO title", text(formData, "seoTitle"), 160],
    ["SEO description", text(formData, "seoDescription"), 320],
  ]);
  if (lengthError) return lengthError;

  const data = {
    businessName,
    tagline: text(formData, "tagline"),
    logoImage,
    faviconUrl,
    phone: text(formData, "phone"),
    email: text(formData, "email"),
    whatsapp: text(formData, "whatsapp").replace(/\D/g, ""),
    address: text(formData, "address"),
    addressLocality: text(formData, "addressLocality"),
    addressRegion: text(formData, "addressRegion"),
    postalCode: text(formData, "postalCode"),
    addressCountry: text(formData, "addressCountry").toUpperCase() || "IN",
    priceRange: optionalText(formData, "priceRange"),
    openingHours: parseOpeningHours(text(formData, "openingHours")),
    serviceAreas: parseList(text(formData, "serviceAreas")),
    instagram: optionalText(formData, "instagram"),
    pinterest: optionalText(formData, "pinterest"),
    googleMapsEmbedUrl,
    googleMapsUrl,
    googleBusinessProfileUrl,
    announcementEnabled: checkbox(formData, "announcementEnabled"),
    announcementText: optionalText(formData, "announcementText"),
    announcementHref: optionalText(formData, "announcementHref"),
    heroEyebrow: text(formData, "heroEyebrow"),
    heroTitle,
    heroDescription: text(formData, "heroDescription"),
    heroImage,
    aboutStory,
    philosophy,
    aboutImage,
    founderName: text(formData, "founderName"),
    founderRole: text(formData, "founderRole"),
    founderImage: optionalText(formData, "founderImage"),
    yearsExperience: numberValue(formData, "yearsExperience"),
    projectsCompleted: numberValue(formData, "projectsCompleted"),
    citiesServed: numberValue(formData, "citiesServed"),
    values: parsePairLines(text(formData, "values")),
    team: parseTeam(text(formData, "team")),
    whyChooseUs: parsePairLines(text(formData, "whyChooseUs")),
    homeProjectsEyebrow: text(formData, "homeProjectsEyebrow"),
    homeProjectsTitle: text(formData, "homeProjectsTitle"),
    homeProjectsDescription: text(formData, "homeProjectsDescription"),
    homeServicesEyebrow: text(formData, "homeServicesEyebrow"),
    homeServicesTitle: text(formData, "homeServicesTitle"),
    homeServicesDescription: text(formData, "homeServicesDescription"),
    homeProductsEyebrow: text(formData, "homeProductsEyebrow"),
    homeProductsTitle: text(formData, "homeProductsTitle"),
    homeProductsDescription: text(formData, "homeProductsDescription"),
    homeWhyEyebrow: text(formData, "homeWhyEyebrow"),
    homeWhyTitle: text(formData, "homeWhyTitle"),
    homeWhyDescription: text(formData, "homeWhyDescription"),
    homeTestimonialsEyebrow: text(formData, "homeTestimonialsEyebrow"),
    homeTestimonialsTitle: text(formData, "homeTestimonialsTitle"),
    homeCtaEyebrow: text(formData, "homeCtaEyebrow"),
    homeCtaTitle: text(formData, "homeCtaTitle"),
    homeCtaDescription: text(formData, "homeCtaDescription"),
    homeCtaImage,
    footerDescription: text(formData, "footerDescription"),
    footerNote: optionalText(formData, "footerNote"),
    seoTitle: text(formData, "seoTitle"),
    seoDescription: text(formData, "seoDescription"),
    seoKeywords: parseList(text(formData, "seoKeywords")),
    ogImage,
  };

  try {
    await prisma.siteSettings.upsert({
      where: { id: "site" },
      create: { id: "site", ...data },
      update: data,
    });
  } catch (error) {
    return databaseError(error);
  }

  refreshPublic([
    "/about",
    "/contact",
    "/products",
    "/services",
    "/portfolio",
    "/admin/settings",
  ]);
  redirect("/admin/settings?saved=1");
}

export async function updateInquiryStatus(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const status = text(formData, "status");
  if (!id || !["NEW", "CONTACTED", "RESOLVED"].includes(status)) return;
  await prisma.inquiry.update({ where: { id }, data: { status } });
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
}

export async function saveInquiryNotes(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  if (!id) return;
  const notes = optionalText(formData, "notes");
  if (notes && notes.length > 10000) return;
  await prisma.inquiry.update({ where: { id }, data: { notes } });
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
  redirect("/admin/inquiries?saved=notes");
}

export async function deleteInquiry(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  if (!id) return;
  await prisma.inquiry.delete({ where: { id } });
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
  redirect("/admin/inquiries?deleted=1");
}
