import { cache } from "react";
import type { Prisma, SiteSettings as SettingsRecordBase } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  demoFaqs,
  demoLocationPages,
  demoPages,
  demoProducts,
  demoProjects,
  demoServices,
  demoSettings,
  demoTestimonials,
  type ContentPage,
  type Faq,
  type LocationPage,
  type Product,
  type Project,
  type Service,
  type SiteContent,
  type TeamMember,
  type Testimonial,
  type ValueItem,
} from "@/lib/demo-data";

const hasDatabase = Boolean(process.env.DATABASE_URL);

async function withFallback<T>(
  query: () => Promise<T>,
  fallback: T,
): Promise<T> {
  if (!hasDatabase) return fallback;

  try {
    return await query();
  } catch (error) {
    console.error(
      "[ivory-oak] Database query failed; serving demo content instead.",
      error,
    );
    return fallback;
  }
}

type ProjectRecord = Prisma.ProjectGetPayload<{
  include: { images: true };
}>;

type ProductRecord = Prisma.ProductGetPayload<{
  include: { images: true; category: true };
}>;

function mapProject(project: ProjectRecord): Project {
  return {
    ...project,
    images: [...project.images].sort((a, b) => a.sortOrder - b.sortOrder),
  };
}

function mapProduct(product: ProductRecord): Product {
  const { category, ...rest } = product;
  return {
    ...rest,
    category: category.name,
    categoryId: product.categoryId,
    images: [...product.images].sort((a, b) => a.sortOrder - b.sortOrder),
  };
}

function parseJsonArray<T>(value: Prisma.JsonValue | null): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

type SettingsRecord = Omit<
  SettingsRecordBase,
  "values" | "team" | "whyChooseUs"
> & {
  values: Prisma.JsonValue;
  team: Prisma.JsonValue;
  whyChooseUs: Prisma.JsonValue;
};

function mapSettings(record: SettingsRecord): SiteContent {
  return {
    ...record,
    values: parseJsonArray<ValueItem>(record.values),
    team: parseJsonArray<TeamMember>(record.team),
    whyChooseUs: parseJsonArray<ValueItem>(record.whyChooseUs),
  };
}

export const getSettings = cache(async (): Promise<SiteContent> => {
  return withFallback(async () => {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "site" },
    });
    return settings ? mapSettings(settings) : demoSettings;
  }, demoSettings);
});

export const getProjects = cache(
  async (options?: { category?: string }): Promise<Project[]> => {
    return withFallback(
      async () => {
        const projects = await prisma.project.findMany({
          where: {
            published: true,
            ...(options?.category ? { category: options.category } : {}),
          },
          include: { images: { orderBy: { sortOrder: "asc" } } },
          orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        });
        return projects.map(mapProject);
      },
      options?.category
        ? demoProjects.filter(
            (project) =>
              project.published && project.category === options.category,
          )
        : demoProjects.filter((project) => project.published),
    );
  },
);

export const getFeaturedProjects = cache(async (): Promise<Project[]> => {
  const projects = await getProjects();
  return projects.filter((project) => project.featured).slice(0, 4);
});

export const getProjectBySlug = cache(
  async (slug: string): Promise<Project | null> => {
    return withFallback(
      async () => {
        const project = await prisma.project.findFirst({
          where: { slug, published: true },
          include: { images: { orderBy: { sortOrder: "asc" } } },
        });
        return project ? mapProject(project) : null;
      },
      demoProjects.find(
        (project) => project.slug === slug && project.published,
      ) ?? null,
    );
  },
);

export const getRelatedProjects = cache(
  async (project: Project): Promise<Project[]> => {
    const projects = await getProjects();
    const sameCategory = projects.filter(
      (item) =>
        item.id !== project.id && item.category === project.category,
    );
    const others = projects.filter(
      (item) =>
        item.id !== project.id && item.category !== project.category,
    );
    return [...sameCategory, ...others].slice(0, 3);
  },
);

export const getServices = cache(async (): Promise<Service[]> => {
  return withFallback(
    async () => {
      return prisma.service.findMany({
        where: { published: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      });
    },
    demoServices
      .filter((service) => service.published)
      .sort((a, b) => a.sortOrder - b.sortOrder),
  );
});

export const getServiceBySlug = cache(
  async (slug: string): Promise<Service | null> => {
    return withFallback(
      async () => {
        return prisma.service.findFirst({
          where: { slug, published: true },
        });
      },
      demoServices.find(
        (service) => service.slug === slug && service.published,
      ) ?? null,
    );
  },
);

export const getProducts = cache(
  async (options?: {
    q?: string;
    category?: string;
  }): Promise<Product[]> => {
    const q = options?.q?.trim() ?? "";
    const category = options?.category?.trim() ?? "";

    return withFallback(
      async () => {
        const products = await prisma.product.findMany({
          where: {
            published: true,
            ...(category ? { category: { name: category } } : {}),
            ...(q
              ? {
                  OR: [
                    { name: { contains: q, mode: "insensitive" } },
                    { description: { contains: q, mode: "insensitive" } },
                    {
                      category: {
                        name: { contains: q, mode: "insensitive" },
                      },
                    },
                    { material: { contains: q, mode: "insensitive" } },
                  ],
                }
              : {}),
          },
          include: {
            images: { orderBy: { sortOrder: "asc" } },
            category: true,
          },
          orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        });
        return products.map(mapProduct);
      },
      demoProducts
        .filter((product) => product.published)
        .filter((product) => (category ? product.category === category : true))
        .filter((product) => {
          if (!q) return true;
          const haystack = [
            product.name,
            product.description,
            product.category,
            product.material ?? "",
          ]
            .join(" ")
            .toLowerCase();
          return haystack.includes(q.toLowerCase());
        })
        .sort((a, b) => a.sortOrder - b.sortOrder),
    );
  },
);

export const getFeaturedProducts = cache(async (): Promise<Product[]> => {
  const products = await getProducts();
  return products.filter((product) => product.featured).slice(0, 4);
});

export const getProductBySlug = cache(
  async (slug: string): Promise<Product | null> => {
    return withFallback(
      async () => {
        const product = await prisma.product.findFirst({
          where: { slug, published: true },
          include: {
            images: { orderBy: { sortOrder: "asc" } },
            category: true,
          },
        });
        return product ? mapProduct(product) : null;
      },
      demoProducts.find(
        (product) => product.slug === slug && product.published,
      ) ?? null,
    );
  },
);

export const getRelatedProducts = cache(
  async (product: Product): Promise<Product[]> => {
    const products = await getProducts();
    const sameCategory = products.filter(
      (item) =>
        item.id !== product.id && item.category === product.category,
    );
    const others = products.filter(
      (item) => item.id !== product.id && item.category !== product.category,
    );
    return [...sameCategory, ...others].slice(0, 4);
  },
);

export const getProductCategories = cache(async (): Promise<string[]> => {
  return withFallback(
    async () => {
      const categories = await prisma.category.findMany({
        where: { published: true },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      });
      return categories.map((category) => category.name);
    },
    Array.from(new Set(demoProducts.map((product) => product.category))).sort(),
  );
});

export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  return withFallback(
    async () => {
      return prisma.testimonial.findMany({
        where: { published: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      });
    },
    demoTestimonials
      .filter((testimonial) => testimonial.published)
      .sort((a, b) => a.sortOrder - b.sortOrder),
  );
});

export const getProjectCategories = cache(async (): Promise<string[]> => {
  const projects = await getProjects();
  return Array.from(new Set(projects.map((project) => project.category))).sort();
});

export const getFaqs = cache(async (): Promise<Faq[]> => {
  return withFallback(
    async () => {
      return prisma.faq.findMany({
        where: { published: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      });
    },
    demoFaqs.filter((faq) => faq.published),
  );
});

export const getFooterPages = cache(async (): Promise<ContentPage[]> => {
  return withFallback(
    async () => {
      return prisma.page.findMany({
        where: { published: true, showInFooter: true },
        orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
      });
    },
    demoPages.filter((page) => page.published && page.showInFooter),
  );
});

export const getPublishedPages = cache(async (): Promise<ContentPage[]> => {
  return withFallback(
    async () => {
      return prisma.page.findMany({
        where: { published: true },
        orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
      });
    },
    demoPages.filter((page) => page.published),
  );
});

export const getPageBySlug = cache(
  async (slug: string): Promise<ContentPage | null> => {
    return withFallback(
      async () => {
        return prisma.page.findFirst({ where: { slug, published: true } });
      },
      demoPages.find((page) => page.slug === slug && page.published) ?? null,
    );
  },
);

export const getLocationPages = cache(async (): Promise<LocationPage[]> => {
  return withFallback(
    async () => {
      return prisma.locationPage.findMany({
        where: { published: true },
        orderBy: [{ sortOrder: "asc" }, { city: "asc" }],
      });
    },
    demoLocationPages
      .filter((location) => location.published)
      .sort((a, b) => a.sortOrder - b.sortOrder),
  );
});

export const getLocationPageBySlug = cache(
  async (slug: string): Promise<LocationPage | null> => {
    return withFallback(
      async () => {
        return prisma.locationPage.findFirst({
          where: { slug, published: true },
        });
      },
      demoLocationPages.find(
        (location) => location.slug === slug && location.published,
      ) ?? null,
    );
  },
);

export const getRedirectForPath = cache(
  async (path: string): Promise<{ toPath: string; statusCode: number } | null> => {
    return withFallback(
      async () => {
        const redirect = await prisma.redirect.findUnique({
          where: { fromPath: path },
          select: { toPath: true, statusCode: true },
        });
        return redirect;
      },
      null,
    );
  },
);
