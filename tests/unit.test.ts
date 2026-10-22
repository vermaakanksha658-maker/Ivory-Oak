import assert from "node:assert/strict";
import test from "node:test";
import { SignJWT } from "jose";
import {
  demoLocationPages,
  demoProducts,
  demoProjects,
  demoServices,
  demoSettings,
} from "../src/lib/demo-data";
import {
  breadcrumbJsonLd,
  buildMetadata,
  siteJsonLd,
  webPageJsonLd,
} from "../src/lib/seo";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  sessionKey,
  verifySessionToken,
} from "../src/lib/session";
import { safeAdminNext } from "../src/lib/redirects";
import { inquirySchema } from "../src/lib/inquiry";
import {
  formatAddress,
  formatDate,
  initials,
  slugify,
  whatsappUrl,
} from "../src/lib/utils";

process.env.NEXT_PUBLIC_SITE_URL = "https://ivory.example/";
process.env.AUTH_SECRET = "test-secret-that-is-long-enough-for-hs256";

test("slugify creates stable URL-safe slugs", () => {
  assert.equal(slugify("Ivory & Oak"), "ivory-and-oak");
  assert.equal(slugify("  The Courtyard House  "), "the-courtyard-house");
  assert.equal(slugify("Wardrobes & Storage"), "wardrobes-and-storage");
  assert.equal(slugify("Café — Hyderabad"), "caf-hyderabad");
});

test("whatsappUrl strips formatting and encodes the message", () => {
  assert.equal(
    whatsappUrl("+91 98490 22118", "Hello & welcome"),
    "https://wa.me/919849022118?text=Hello%20%26%20welcome",
  );
});

test("formatAddress composes structured address fields without duplicates", () => {
  assert.equal(
    formatAddress(demoSettings),
    "12A, Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033",
  );
  assert.equal(
    formatAddress({
      address: "",
      addressLocality: "Hyderabad",
      addressRegion: "",
      postalCode: "",
    }),
    "Hyderabad",
  );
});

test("formatting helpers handle dates and names", () => {
  assert.equal(formatDate("2025-01-15T10:00:00.000Z"), "15 Jan 2025");
  assert.equal(initials("Ananya Sharma"), "AS");
  assert.equal(initials("Ivory"), "I");
});

test("safeAdminNext only allows same-origin admin destinations", () => {
  assert.equal(safeAdminNext(null), "/admin");
  assert.equal(safeAdminNext(""), "/admin");
  assert.equal(safeAdminNext("/admin"), "/admin");
  assert.equal(
    safeAdminNext("/admin/products?page=2#catalog"),
    "/admin/products?page=2#catalog",
  );
  assert.equal(safeAdminNext("/admin/login"), "/admin");
  assert.equal(safeAdminNext("/admin/login?next=/admin"), "/admin");
  assert.equal(safeAdminNext("/adminiscuous"), "/admin");
  assert.equal(safeAdminNext("/admin/../contact"), "/admin");
  assert.equal(safeAdminNext("/contact"), "/admin");
  assert.equal(safeAdminNext("//evil.example/admin"), "/admin");
  assert.equal(safeAdminNext("https://evil.example/admin"), "/admin");
});

test("inquirySchema accepts valid enquiries and normalises blank email", () => {
  const parsed = inquirySchema.safeParse({
    name: "Ananya Sharma",
    phone: "+91 98765 43210",
    email: "",
    message: "We are renovating a three-bedroom apartment in Hyderabad.",
    source: "product",
    productId: "product-aranya-chair",
    website: "",
  });

  assert.equal(parsed.success, true);
  if (parsed.success) {
    assert.equal(parsed.data.email, null);
    assert.equal(parsed.data.source, "product");
  }
});

test("inquirySchema rejects incomplete or malformed enquiries", () => {
  const base = {
    name: "Ananya Sharma",
    phone: "+91 98765 43210",
    message: "We are renovating a three-bedroom apartment in Hyderabad.",
  };

  assert.equal(inquirySchema.safeParse({ ...base, name: "A" }).success, false);
  assert.equal(
    inquirySchema.safeParse({ ...base, phone: "abc" }).success,
    false,
  );
  assert.equal(
    inquirySchema.safeParse({ ...base, email: "not-an-email" }).success,
    false,
  );
  assert.equal(
    inquirySchema.safeParse({ ...base, message: "Too short" }).success,
    false,
  );
  assert.equal(
    inquirySchema.safeParse({ ...base, source: "checkout" }).success,
    false,
  );
  assert.equal(
    inquirySchema.safeParse({ ...base, productId: "x".repeat(65) }).success,
    false,
  );
});

test("buildMetadata sets a page canonical, share image, and optional noindex", () => {
  const metadata = buildMetadata(demoSettings, {
    title: "Contact & Studio Visits",
    description: "Talk to the studio about your project.",
    path: "/contact",
    image: "/images/contact.jpg",
  });

  assert.deepEqual(metadata.alternates, { canonical: "/contact" });
  assert.equal(metadata.title, "Contact & Studio Visits");
  assert.equal(metadata.description, "Talk to the studio about your project.");

  const openGraph = metadata.openGraph as {
    url: string;
    siteName: string;
    images: { url: string; alt: string }[];
  };
  assert.equal(openGraph.url, "https://ivory.example/contact");
  assert.equal(openGraph.siteName, "Ivory & Oak");
  assert.equal(openGraph.images[0].url, "https://ivory.example/images/contact.jpg");
  assert.match(openGraph.images[0].alt, /interior design studio/);

  const hidden = buildMetadata(demoSettings, {
    title: "Draft page",
    description: "Not ready.",
    path: "/draft",
    noIndex: true,
  });
  assert.deepEqual(hidden.robots, { index: false, follow: false });
});

test("siteJsonLd exposes verified business details and opening hours", () => {
  const data = siteJsonLd(demoSettings) as {
    "@graph": Array<Record<string, unknown>>;
  };
  const business = data["@graph"][0] as {
    "@id": string;
    name: string;
    address: Record<string, string>;
    openingHoursSpecification: Array<{
      dayOfWeek: string[];
      opens: string;
      closes: string;
    }>;
    areaServed: Array<{ name: string }>;
  };
  const website = data["@graph"][1] as { "@id": string; publisher: { "@id": string } };

  assert.equal(business["@id"], "https://ivory.example/#business");
  assert.equal(business.name, "Ivory & Oak");
  assert.equal(business.address.addressLocality, "Hyderabad");
  assert.equal(business.address.addressCountry, "IN");
  assert.equal(business.openingHoursSpecification.length, 1);
  assert.deepEqual(business.openingHoursSpecification[0].dayOfWeek, [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]);
  assert.equal(business.openingHoursSpecification[0].opens, "10:00");
  assert.equal(business.openingHoursSpecification[0].closes, "18:00");
  assert.deepEqual(
    business.areaServed.map((area) => area.name),
    demoSettings.serviceAreas,
  );
  assert.equal(website["@id"], "https://ivory.example/#website");
  assert.equal(website.publisher["@id"], "https://ivory.example/#business");
});

test("breadcrumb and WebPage JSON-LD use absolute URLs", () => {
  const breadcrumbs = breadcrumbJsonLd([
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
  ]) as { itemListElement: Array<{ item: string; position: number }> };

  assert.equal(breadcrumbs.itemListElement[0].item, "https://ivory.example/");
  assert.equal(breadcrumbs.itemListElement[1].position, 2);
  assert.equal(
    breadcrumbs.itemListElement[1].item,
    "https://ivory.example/services",
  );

  const page = webPageJsonLd({
    name: "Contact",
    description: "Talk to the studio.",
    path: "/contact",
  });
  assert.equal(page.url, "https://ivory.example/contact");
  assert.equal(page.isPartOf["@id"], "https://ivory.example/#website");
  assert.equal(page.about["@id"], "https://ivory.example/#business");
});

test("session tokens round-trip and reject invalid payloads", async () => {
  const key = sessionKey();
  assert.ok(key);
  assert.equal(SESSION_COOKIE, "ivory_oak_session");
  assert.equal(SESSION_MAX_AGE, 60 * 60 * 8);

  const token = await new SignJWT({
    userId: "admin-1",
    email: "admin@ivoryandoak.in",
    name: "Studio Admin",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(key);

  assert.deepEqual(await verifySessionToken(token), {
    userId: "admin-1",
    email: "admin@ivoryandoak.in",
    name: "Studio Admin",
  });
  assert.equal(await verifySessionToken(undefined), null);
  assert.equal(await verifySessionToken("not-a-jwt"), null);

  const incomplete = await new SignJWT({ userId: "admin-1" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1h")
    .sign(key);
  assert.equal(await verifySessionToken(incomplete), null);

  const wrongKey = new TextEncoder().encode("a-different-secret");
  const wrongToken = await new SignJWT({
    userId: "admin-1",
    email: "admin@ivoryandoak.in",
    name: "Studio Admin",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1h")
    .sign(wrongKey);
  assert.equal(await verifySessionToken(wrongToken), null);
});

test("demo content keeps unique slugs and genuine location pages", () => {
  const collections = [
    demoProjects.map((item) => item.slug),
    demoServices.map((item) => item.slug),
    demoProducts.map((item) => item.slug),
    demoLocationPages.map((item) => item.slug),
  ];

  for (const slugs of collections) {
    assert.equal(new Set(slugs).size, slugs.length);
    assert.ok(slugs.every((slug) => slug === slugify(slug)));
  }

  assert.deepEqual(
    demoLocationPages.map((location) => location.city).sort(),
    ["Bengaluru", "Hyderabad"],
  );

  for (const location of demoLocationPages) {
    assert.ok(
      demoSettings.serviceAreas.includes(location.city),
      `${location.city} should be a genuine service area`,
    );
    assert.ok(location.seoTitle);
    assert.ok(location.seoDescription);
    assert.ok(location.content.length > 200);
  }
});
