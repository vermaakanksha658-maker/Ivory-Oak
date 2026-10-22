const baseUrl = (process.env.SMOKE_BASE_URL ?? process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");

const coreRoutes = [
  "/",
  "/about",
  "/services",
  "/portfolio",
  "/products",
  "/contact",
  "/locations",
  "/sitemap.xml",
  "/robots.txt",
  "/admin/login",
  "/does-not-exist",
];

function absolute(path) {
  return `${baseUrl}${path}`;
}

async function request(path, options = {}) {
  return fetch(absolute(path), {
    signal: AbortSignal.timeout(15000),
    ...options,
  });
}

const failures = [];
let checks = 0;

function check(condition, message) {
  checks += 1;
  if (!condition) failures.push(message);
}

function expectStatus(response, status, label) {
  check(
    response.status === status,
    `${label}: expected ${status}, received ${response.status}`,
  );
}

async function checkSitemap() {
  const response = await request("/sitemap.xml");
  expectStatus(response, 200, "/sitemap.xml");
  if (!response.ok) return;

  const xml = await response.text();
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map((match) => match[1].replaceAll("&amp;", "&"))
    .filter((url) => url.startsWith(baseUrl));

  check(urls.length > 0, "Sitemap should contain at least one URL");

  for (const url of [...new Set(urls)]) {
    const path = url.slice(baseUrl.length) || "/";
    const page = await request(path);
    expectStatus(page, 200, `sitemap URL ${path}`);
  }
}

async function checkProtectedRoutes() {
  const admin = await request("/admin", { redirect: "manual" });
  check(
    admin.status >= 300 && admin.status < 400,
    `/admin: expected a sign-in redirect, received ${admin.status}`,
  );
  check(
    (admin.headers.get("location") ?? "").includes("/admin/login"),
    "/admin should redirect to /admin/login",
  );
  check(
    (admin.headers.get("x-robots-tag") ?? "").includes("noindex"),
    "/admin should send an X-Robots-Tag noindex header",
  );

  const upload = await request("/api/admin/upload", {
    method: "POST",
    redirect: "manual",
  });
  expectStatus(upload, 401, "unauthorized upload");
  check(
    (upload.headers.get("x-robots-tag") ?? "").includes("noindex"),
    "/api/admin should send an X-Robots-Tag noindex header",
  );
}

async function main() {
  console.log(`Smoke testing ${baseUrl}`);

  for (const path of coreRoutes) {
    const response = await request(path);
    const expected = path === "/does-not-exist" ? 404 : 200;
    expectStatus(response, expected, path);
  }

  const login = await request("/admin/login");
  check(
    (login.headers.get("x-robots-tag") ?? "").includes("noindex"),
    "/admin/login should send an X-Robots-Tag noindex header",
  );

  const robots = await request("/robots.txt");
  if (robots.ok) {
    const text = await robots.text();
    check(text.includes("Disallow: /admin"), "robots.txt should disallow /admin");
    check(text.includes("Sitemap:"), "robots.txt should advertise the sitemap");
  }

  await checkSitemap();
  await checkProtectedRoutes();

  if (failures.length > 0) {
    console.error(`\n${failures.length} of ${checks} checks failed:`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
    return;
  }

  console.log(`\nAll ${checks} smoke checks passed.`);
}

main().catch((error) => {
  console.error("Smoke test failed to run:", error);
  process.exitCode = 1;
});
