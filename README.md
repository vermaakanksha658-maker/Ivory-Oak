# Ivory & Oak

A premium website for an interior design studio. Visitors can explore projects, services, and an enquiry-only product catalog, then get in touch by form, WhatsApp, phone, or email.

There is no cart, checkout, payment gateway, shipping, or online ordering. Products are presented for conversation, not transaction.

## Built with

- Next.js 16 (App Router, Server Actions, Turbopack)
- React 19 and TypeScript
- Tailwind CSS 4
- PostgreSQL with Prisma 6
- JWT admin sessions (`jose`) and bcrypt password hashing
- Cloudinary signed uploads
- Zod validation for public enquiries
- Lucide icons and self-hosted Google fonts

## Features

### Public site

- Editorial home page driven by editable site settings: hero, section headings, featured work, services, products, testimonials, and CTA
- About page with studio story, values, team, philosophy, and numbers
- Services listing and detail pages with optional per-page SEO
- Portfolio with category filters, project galleries, lightbox, optional before/after slider, and per-project SEO
- Product catalog with search, category filter, sorting, detail galleries, specifications, per-product SEO, and WhatsApp enquiry
- Contact page with validated enquiry form, service prefill, FAQs, studio details, map, directions, opening hours, and Google Business Profile link
- Local landing pages for genuine service areas, with city-specific content and relevant projects
- Editable logo, announcement bar, footer copy, and policy-page links
- Responsive navigation, sticky mobile CTA, floating WhatsApp button, reduced-motion support
- Per-page metadata and canonicals, Open Graph/Twitter cards, social sharing images, structured data, breadcrumbs, sitemap, robots rules, and dynamic favicon
- Automatic 308 redirects when a published URL slug changes

### Admin

- Secure login at `/admin/login`
- Dashboard with published counts, new enquiries, and quick actions
- CRUD for projects, services, products, categories, testimonials, FAQs, policy pages, and location pages
- Reordering for projects, services, products, categories, FAQs, and pages
- Publish/unpublish toggles and searchable, paginated tables
- Multi-image project and product galleries with ordering and alt text
- Product categories with safe deletion rules
- Per-record SEO and social sharing image fields for projects, services, products, pages, and locations
- Cloudinary uploads or direct image URLs
- Site-wide content editor for branding, structured address, opening hours, map/profile links, hero, home sections, CTA, footer, and global SEO
- Enquiry inbox with status workflow (`New`, `Contacted`, `Resolved`), internal notes, search, and related product/service context

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in the values.

```bash
copy .env.example .env
```

Generate an auth secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

At minimum, set `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.

### 3. Set up PostgreSQL

Use a local PostgreSQL database or a hosted provider such as Neon or Supabase.

The repository includes an initial migration in `prisma/migrations/20261023000000_init`. Apply it with:

```bash
npx prisma migrate deploy
```

For local development, `npm run db:migrate` applies pending migrations and creates new ones when the schema changes. `npm run db:push` remains available for disposable databases but does not use the migration history.

### 4. Seed the database

The seed creates your admin account and loads the demo content. Set `ADMIN_PASSWORD` to at least 8 characters first.

```bash
npm run db:seed
```

The admin email and password come from `ADMIN_EMAIL` and `ADMIN_PASSWORD`. The password is bcrypt-hashed and never stored in plain text. Re-running the seed updates the admin password and resets demo content entries; FAQ seeding replaces all FAQ rows.

### 5. Run the site

```bash
npm run dev
```

- Public site: http://localhost:3000
- Admin: http://localhost:3000/admin

## Demo fallback

Public pages use the content in `src/lib/demo-data.ts` when `DATABASE_URL` is not set or a database query fails. This lets you preview the design before setting up PostgreSQL.

The fallback is read-only. Admin login, admin CRUD, and enquiry storage require a working database.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes for admin | PostgreSQL connection string |
| `AUTH_SECRET` | Yes | Signs admin session JWTs; use a long random value |
| `NEXT_PUBLIC_SITE_URL` | Yes in production | Canonical site URL, sitemap, structured data, and metadata |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | No | Search Console HTML verification token |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No | GA4 measurement ID; analytics stays off when blank |
| `ADMIN_EMAIL` | Yes for seed | Initial admin login email |
| `ADMIN_NAME` | No | Admin display name |
| `ADMIN_PASSWORD` | Yes for seed | Initial admin password, minimum 8 characters |
| `RESEND_API_KEY` | No | Sends enquiry notification email through Resend |
| `INQUIRY_FROM_EMAIL` | No | Verified Resend sender, for example `Ivory & Oak <enquiries@yourdomain.com>` |
| `INQUIRY_NOTIFICATION_EMAIL` | No | Studio inbox for new enquiry notifications |
| `CLOUDINARY_CLOUD_NAME` | No | Cloudinary uploads |
| `CLOUDINARY_API_KEY` | No | Cloudinary uploads |
| `CLOUDINARY_API_SECRET` | No | Cloudinary signed uploads |
| `CLOUDINARY_FOLDER` | No | Upload folder, defaults to `ivory-and-oak` |

Cloudinary is optional. Without it, admins can still paste hosted image URLs. Uploads return a clear configuration error until credentials are set.

Enquiry email is optional. Inquiries are saved to the database first. If the three Resend variables are present, the studio also receives an email; a delivery failure is logged and does not lose the inquiry.

## Image hosts

`next.config.ts` allows remote images from Unsplash, Cloudinary, and Pexels. If you paste an image URL from another host, add that hostname to `images.remotePatterns` or upload the image to Cloudinary.

## Content editing

Sign in at `/admin/login` and use the sidebar.

- **Site settings:** business identity, logo/favicon, announcement bar, contact details, hero, homepage section copy, CTA, footer, social links, and global SEO.
- **Categories:** products require a category. A category with products cannot be deleted until those products are moved or removed.
- **FAQs:** published FAQs appear on the contact page and in FAQ structured data.
- **Policy pages:** published pages appear at `/{slug}`; enable “show in footer” to link a page from the site footer.
- **Page content:** use `## ` for headings and blank lines between paragraphs. Raw HTML is not rendered.
- **Homepage headings:** line breaks are preserved; the final line is rendered in italic olive.
- **Product specifications:** one `Label: value` entry per line.
- **Values / why choose us:** `Title | Description`, one per line.
- **Team:** `Name | Role | Bio | Image URL`, one per line.
- **Gallery:** managed through the image field; order is set with the arrow buttons.
- **Service areas:** one city per line. These populate `areaServed` and the footer links.
- **Locations:** publish a local page only for a city you genuinely serve. Add city-specific content, relevant projects, and a unique introduction; do not duplicate the same page across cities.
- **Address:** enter the street and building only. City, state, postcode, and country come from their own fields. All five are used for the footer, contact page, and structured data.
- **Opening hours:** one schedule per line, formatted as `Monday-Saturday|10:00-18:00`. Use `Sunday|Closed` for closed days.
- **Redirects:** changing a project, service, product, page, or location slug automatically creates a permanent 308 redirect from the old path. If a new slug is already in use, the form reports it instead of overwriting content.

Saving content clears affected public paths through `revalidatePath`, so changes appear without a redeploy. Featured/published changes also refresh the sitemap.

## SEO, local search, and analytics

- Every public page sets its own canonical. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS domain before launch so canonicals, Open Graph URLs, structured data, and the sitemap are absolute and correct.
- The sitemap includes projects, services, products, published pages, and location pages. `/admin` and `/api` are excluded from crawling and return `X-Robots-Tag: noindex, nofollow`.
- Validate business details in **Site content**: legal name, phone, email, structured address, opening hours, and maps links. Keep them identical to your Google Business Profile.
- Add the Search Console verification token through `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, deploy, then submit `/sitemap.xml`.
- Location pages are editorial landing pages, not copies of one template with a swapped city name. Publish only places where the studio has genuine experience and capacity.
- GA4 is loaded only when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set. Update the privacy policy and any consent mechanism required in your jurisdiction before enabling it.
- The privacy-policy demo content includes analytics/cookie language. Replace all policy content with text reviewed for your business before launch.

## Admin authentication

- Passwords are bcrypt-hashed with cost 12.
- Sessions are HS256 JWTs stored in the HttpOnly `ivory_oak_session` cookie.
- Sessions expire after 8 hours.
- `src/proxy.ts` protects `/admin/*` and `/api/admin/*`.
- Server actions and the upload route re-check the session; proxy protection is not the only guard.

There is no password-reset UI. To reset a password, update `ADMIN_PASSWORD` and re-run `npm run db:seed`.

## Enquiry protection

The contact API uses Zod validation, a honeypot field, a minimum submit delay, and an in-memory IP rate limit. The in-memory limiter is per server instance; for multi-instance deployments, move rate limiting to Redis or your hosting provider's edge controls.

## Testing

Run the automated unit suite:

```bash
npm test
```

The suite uses Node's built-in test runner through `tsx` and covers URL/slug helpers, address formatting, safe admin redirects, enquiry validation, metadata and structured data, JWT session verification, and demo-content invariants. It does not require a database.

Run the HTTP smoke test against a running site:

```bash
npm run build
npm run start
# in a second terminal:
npm run smoke
```

`npm run smoke` checks core pages, sitemap URLs, robots rules, 404 handling, the admin login redirect, unauthorized upload protection, and `noindex` headers. Set `SMOKE_BASE_URL` to test a deployed environment:

```bash
$env:SMOKE_BASE_URL="https://www.yourdomain.com"; npm run smoke
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript without emitting |
| `npm test` | Run the automated unit tests |
| `npm run smoke` | Run HTTP smoke checks against a running site |
| `npm run db:generate` | Regenerate the Prisma client |
| `npm run db:push` | Push the Prisma schema to a disposable database |
| `npm run db:migrate` | Create and apply a development migration |
| `npm run db:seed` | Seed the admin and demo content |
| `npm run db:studio` | Open Prisma Studio |

## Deployment

1. Create a hosted PostgreSQL database and set `DATABASE_URL`.
2. Set `AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL`, and any optional Cloudinary, Resend, Search Console, and GA4 variables in your host.
3. Apply migrations:

   ```bash
   npx prisma migrate deploy
   ```

4. Seed the production admin once:

   ```bash
   npm run db:seed
   ```

   Unset or replace `ADMIN_PASSWORD` after seeding if you do not want future seed runs to reset it.

5. Deploy. `postinstall` runs `prisma generate` automatically.

On Vercel, add all environment variables for the Production environment. Ensure the database accepts connections from your deployment region.

## Launch checklist

### Configuration and data

- [ ] Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS domain, with no trailing slash.
- [ ] Set a unique production `AUTH_SECRET`; do not use the development fallback.
- [ ] Apply `npx prisma migrate deploy` against the production database.
- [ ] Seed once, sign in, then change or remove `ADMIN_PASSWORD` from production secrets.
- [ ] Replace all demo content, images, policies, phone numbers, addresses, and service areas with verified studio information.
- [ ] Confirm `Site content` matches the Google Business Profile name, phone, address, hours, and map links.
- [ ] Publish location pages only for cities with genuine experience and capacity.
- [ ] Configure Cloudinary if admins need in-browser uploads; otherwise verify hosted image URLs.
- [ ] Configure Resend and send one test enquiry before launch.

### Functional checks

- [ ] Sign in at `/admin/login`; confirm logout and an expired/invalid session return to login.
- [ ] Create, edit, publish, unpublish, reorder, and delete a test item in every admin section.
- [ ] Submit an enquiry from the contact form and a product page; confirm it appears in the admin inbox.
- [ ] Update enquiry status/notes, then delete the test enquiries.
- [ ] Change one published slug and confirm the old URL returns a 308 to the new URL.
- [ ] Confirm each footer, header, service, project, product, location, and CTA link resolves.
- [ ] Test phone, email, WhatsApp, Maps, and Google Business Profile links on a real phone.
- [ ] Verify image uploads, gallery ordering, alt text, and social share images.

### SEO, analytics, and security

- [ ] Run `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build`.
- [ ] Run `npm run smoke` against the deployed URL.
- [ ] Confirm `/robots.txt` and `/sitemap.xml` return 200 and use the production domain.
- [ ] Confirm `/admin` and `/api` are not indexable.
- [ ] Submit the sitemap in Search Console and verify the site property.
- [ ] Validate structured data and social cards for home, service, project, product, location, and contact pages.
- [ ] Enable GA4 only after reviewing privacy/consent requirements; update the privacy policy accordingly.
- [ ] Confirm no secrets or `.env` files are committed.
- [ ] Check the site on a narrow phone, tablet, desktop, and with reduced motion enabled.

## Project structure

```text
prisma/
  schema.prisma        Database models
  migrations/          PostgreSQL migration history
  seed.ts              Admin and demo-content seed
src/
  app/
    (site)/            Public pages, policies, and detail routes
    admin/             Login, dashboard, CRUD, server actions
    api/               Enquiries and signed uploads
    sitemap.ts
    robots.ts
  components/
    admin/             Admin shell, forms, tables, gallery and image fields
    analytics/         Optional GA4 loader
    contact/           Public enquiry form
    content/           Safe rich-text renderer for policy/location content
    layout/            Header, footer, floating actions
    products/          Product gallery
    projects/          Project gallery, before/after
    seo/               JSON-LD and breadcrumb rendering
    ui/                Buttons, headings, logo, reveal, social icons
  lib/
    auth.ts            Session checks
    session.ts         JWT signing and cookie handling
    data.ts            Public queries with demo fallback
    demo-data.ts       Demo content and domain types
    email.ts           Optional Resend enquiry notifications
    prisma.ts          Prisma singleton
    seo.ts             Metadata, canonical, and structured-data builders
    utils.ts           Formatting and URL helpers
  proxy.ts             Admin route protection
```

## Notes

- The design is intentionally catalog-only. Do not add checkout flows without revisiting the product brief.
- All demo content and images are placeholders and should be replaced with the studio's own work and details.
- Do not invent reviews, ratings, project counts, prices, awards, rankings, or service areas. Use only verified business information.
- Keep `.env` out of version control. Only `.env.example` is committed.
