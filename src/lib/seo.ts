import type { Metadata } from "next";
import type { SiteContent } from "@/lib/demo-data";
import { siteUrl } from "@/lib/utils";

export type BreadcrumbItem = {
  label: string;
  href: string;
};

type MetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  imageAlt?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  absoluteTitle?: boolean;
};

function absoluteUrl(value: string): string {
  try {
    return new URL(value, siteUrl()).toString();
  } catch {
    return siteUrl();
  }
}

export function buildMetadata(
  settings: SiteContent,
  {
    title,
    description,
    path,
    image,
    imageAlt,
    type = "website",
    noIndex = false,
    absoluteTitle = false,
  }: MetadataInput,
): Metadata {
  const shareImage = absoluteUrl(
    image ?? settings.ogImage ?? settings.heroImage,
  );
  const alt =
    imageAlt ?? `${settings.businessName} interior design studio`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: "en_IN",
      url: absoluteUrl(path),
      siteName: settings.businessName,
      title,
      description,
      images: [{ url: shareImage, alt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [shareImage],
    },
    ...(noIndex
      ? { robots: { index: false, follow: false } }
      : {}),
  };
}

function schemaAddress(settings: SiteContent) {
  return {
    "@type": "PostalAddress",
    streetAddress: settings.address,
    addressLocality: settings.addressLocality,
    addressRegion: settings.addressRegion,
    postalCode: settings.postalCode,
    addressCountry: settings.addressCountry,
  };
}

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function daysOfWeek(value: string): string[] {
  const lookup = new Map(
    weekdays.map((day) => [day.toLowerCase(), day] as const),
  );
  const days = value
    .split(",")
    .flatMap((part) => {
      const token = part.trim().toLowerCase();
      if (!token) return [];

      const [start, end] = token.split("-").map((day) => day.trim());
      const startIndex = weekdays.findIndex(
        (day) => day.toLowerCase() === start,
      );

      if (startIndex === -1) return [];
      if (!end) return [weekdays[startIndex]];

      const endIndex = weekdays.findIndex((day) => day.toLowerCase() === end);
      if (endIndex === -1) return [weekdays[startIndex]];

      const result: string[] = [];
      for (let index = startIndex; index <= endIndex; index += 1) {
        result.push(weekdays[index]);
      }
      return result;
    });

  return Array.from(
    new Set(days.map((day) => lookup.get(day.toLowerCase())).filter(Boolean)),
  ) as string[];
}

function openingHoursSpecification(settings: SiteContent) {
  return settings.openingHours.flatMap((entry) => {
    const [days, hours] = entry.split("|").map((part) => part.trim());
    if (!days || !hours || /^closed$/i.test(hours)) return [];

    const [opens, closes] = hours.split("-").map((part) => part.trim());
    if (!opens || !closes) return [];

    const dayOfWeek = daysOfWeek(days);
    if (dayOfWeek.length === 0) return [];

    return [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek,
        opens,
        closes,
      },
    ];
  });
}

export function siteJsonLd(settings: SiteContent) {
  const base = siteUrl();
  const businessId = `${base}/#business`;
  const websiteId = `${base}/#website`;
  const sameAs = [
    settings.instagram,
    settings.pinterest,
    settings.googleBusinessProfileUrl,
  ].filter((value): value is string => Boolean(value));
  const hours = openingHoursSpecification(settings);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "InteriorDesigner"],
        "@id": businessId,
        name: settings.businessName,
        description: settings.seoDescription || settings.tagline,
        url: `${base}/`,
        telephone: settings.phone,
        email: settings.email,
        image: absoluteUrl(settings.ogImage ?? settings.heroImage),
        logo: settings.logoImage
          ? absoluteUrl(settings.logoImage)
          : undefined,
        address: schemaAddress(settings),
        areaServed: settings.serviceAreas.map((name) => ({
          "@type": "City",
          name,
        })),
        openingHoursSpecification: hours.length > 0 ? hours : undefined,
        priceRange: settings.priceRange || undefined,
        hasMap: settings.googleMapsUrl || undefined,
        sameAs: sameAs.length > 0 ? sameAs : undefined,
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: `${base}/`,
        name: settings.businessName,
        inLanguage: "en-IN",
        publisher: { "@id": businessId },
      },
    ],
  };
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  };
}

export function webPageJsonLd({
  name,
  description,
  path,
}: {
  name: string;
  description?: string | null;
  path: string;
}) {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description: description ?? undefined,
    url: absoluteUrl(path),
    isPartOf: { "@id": `${base}/#website` },
    about: { "@id": `${base}/#business` },
  };
}

export { absoluteUrl };
