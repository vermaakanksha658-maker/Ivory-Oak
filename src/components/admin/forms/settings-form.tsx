import { AdminForm } from "@/components/admin/admin-form";
import { ImageField } from "@/components/admin/image-field";
import { saveSettings } from "@/app/admin/actions";
import type { SiteContent } from "@/lib/demo-data";

export function SettingsForm({ settings }: { settings: SiteContent }) {
  const values = settings.values
    .map((item) => `${item.title} | ${item.description}`)
    .join("\n");
  const whyChooseUs = settings.whyChooseUs
    .map((item) => `${item.title} | ${item.description}`)
    .join("\n");
  const team = settings.team
    .map(
      (member) =>
        `${member.name} | ${member.role} | ${member.bio} | ${member.image}`,
    )
    .join("\n");

  return (
    <AdminForm
      action={saveSettings}
      cancelHref="/admin"
      submitLabel="Save site content"
    >
      <div className="space-y-6">
        <section className="border border-charcoal/10 bg-cream p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="font-display text-xl text-charcoal">
              Studio & contact
            </h2>
            <p className="mt-1 text-[0.6875rem] text-charcoal/40">
              Used in the header, footer, contact page, and WhatsApp links.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="businessName" className="admin-label">
                Business name <span className="text-gold">*</span>
              </label>
              <input
                id="businessName"
                name="businessName"
                type="text"
                required
                defaultValue={settings.businessName}
                className="admin-field"
              />
            </div>
            <div>
              <label htmlFor="tagline" className="admin-label">
                Tagline
              </label>
              <input
                id="tagline"
                name="tagline"
                type="text"
                defaultValue={settings.tagline}
                className="admin-field"
              />
            </div>
            <div className="sm:col-span-2 grid gap-6 lg:grid-cols-2">
              <ImageField
                label="Logo image"
                name="logoImage"
                defaultValue={settings.logoImage ?? ""}
                help="Optional. Leave empty to use the text wordmark."
              />
              <ImageField
                label="Favicon"
                name="faviconUrl"
                defaultValue={settings.faviconUrl ?? ""}
                help="A square PNG or SVG works best in browser tabs."
              />
            </div>
            <div>
              <label htmlFor="phone" className="admin-label">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                defaultValue={settings.phone}
                className="admin-field"
              />
            </div>
            <div>
              <label htmlFor="email" className="admin-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={settings.email}
                className="admin-field"
              />
            </div>
            <div>
              <label htmlFor="whatsapp" className="admin-label">
                WhatsApp number
              </label>
              <input
                id="whatsapp"
                name="whatsapp"
                type="text"
                defaultValue={settings.whatsapp}
                className="admin-field"
                placeholder="919849022118"
              />
              <p className="mt-1.5 text-[0.625rem] text-charcoal/35">
                Digits only, including country code. No + or spaces.
              </p>
            </div>
            <div>
              <label htmlFor="serviceAreas" className="admin-label">
                Service areas
              </label>
              <textarea
                id="serviceAreas"
                name="serviceAreas"
                rows={4}
                defaultValue={settings.serviceAreas.join("\n")}
                className="admin-field resize-y"
              />
              <p className="mt-1.5 text-[0.625rem] text-charcoal/35">
                One city per line.
              </p>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="address" className="admin-label">
                Street address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                defaultValue={settings.address}
                className="admin-field"
                placeholder="12A, Road No. 36, Jubilee Hills"
              />
              <p className="mt-1.5 text-[0.625rem] text-charcoal/35">
                Street and building only. City, region, and postcode are added
                below.
              </p>
            </div>
            <div>
              <label htmlFor="addressLocality" className="admin-label">
                City
              </label>
              <input
                id="addressLocality"
                name="addressLocality"
                type="text"
                defaultValue={settings.addressLocality}
                className="admin-field"
                placeholder="Hyderabad"
              />
            </div>
            <div>
              <label htmlFor="addressRegion" className="admin-label">
                State or region
              </label>
              <input
                id="addressRegion"
                name="addressRegion"
                type="text"
                defaultValue={settings.addressRegion}
                className="admin-field"
                placeholder="Telangana"
              />
            </div>
            <div>
              <label htmlFor="postalCode" className="admin-label">
                Postal code
              </label>
              <input
                id="postalCode"
                name="postalCode"
                type="text"
                defaultValue={settings.postalCode}
                className="admin-field"
                placeholder="500033"
              />
            </div>
            <div>
              <label htmlFor="addressCountry" className="admin-label">
                Country code
              </label>
              <input
                id="addressCountry"
                name="addressCountry"
                type="text"
                maxLength={2}
                defaultValue={settings.addressCountry}
                className="admin-field"
                placeholder="IN"
              />
            </div>
            <div>
              <label htmlFor="priceRange" className="admin-label">
                Price range
              </label>
              <input
                id="priceRange"
                name="priceRange"
                type="text"
                defaultValue={settings.priceRange ?? ""}
                className="admin-field"
                placeholder="e.g. ₹₹₹"
              />
              <p className="mt-1.5 text-[0.625rem] text-charcoal/35">
                Optional. Leave blank if you prefer not to publish one.
              </p>
            </div>
            <div>
              <label htmlFor="openingHours" className="admin-label">
                Opening hours
              </label>
              <textarea
                id="openingHours"
                name="openingHours"
                rows={4}
                defaultValue={settings.openingHours.join("\n")}
                className="admin-field resize-y"
                placeholder={"Monday-Saturday|10:00-18:00\nSunday|Closed"}
              />
              <p className="mt-1.5 text-[0.625rem] text-charcoal/35">
                One line per schedule: days | hours. Use &quot;Closed&quot; for
                closed days.
              </p>
            </div>
            <div>
              <label htmlFor="instagram" className="admin-label">
                Instagram URL
              </label>
              <input
                id="instagram"
                name="instagram"
                type="url"
                defaultValue={settings.instagram ?? ""}
                className="admin-field"
              />
            </div>
            <div>
              <label htmlFor="pinterest" className="admin-label">
                Pinterest URL
              </label>
              <input
                id="pinterest"
                name="pinterest"
                type="url"
                defaultValue={settings.pinterest ?? ""}
                className="admin-field"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="googleMapsEmbedUrl" className="admin-label">
                Google Maps embed URL
              </label>
              <input
                id="googleMapsEmbedUrl"
                name="googleMapsEmbedUrl"
                type="url"
                defaultValue={settings.googleMapsEmbedUrl ?? ""}
                className="admin-field"
                placeholder="https://www.google.com/maps?q=...&output=embed"
              />
            </div>
            <div>
              <label htmlFor="googleMapsUrl" className="admin-label">
                Google Maps directions URL
              </label>
              <input
                id="googleMapsUrl"
                name="googleMapsUrl"
                type="url"
                defaultValue={settings.googleMapsUrl ?? ""}
                className="admin-field"
                placeholder="https://maps.google.com/?q=..."
              />
            </div>
            <div>
              <label htmlFor="googleBusinessProfileUrl" className="admin-label">
                Google Business Profile URL
              </label>
              <input
                id="googleBusinessProfileUrl"
                name="googleBusinessProfileUrl"
                type="url"
                defaultValue={settings.googleBusinessProfileUrl ?? ""}
                className="admin-field"
                placeholder="https://g.page/..."
              />
              <p className="mt-1.5 text-[0.625rem] text-charcoal/35">
                Optional. Add only your verified profile.
              </p>
            </div>
          </div>
        </section>

        <section className="border border-charcoal/10 bg-cream p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="font-display text-xl text-charcoal">Homepage hero</h2>
            <p className="mt-1 text-[0.6875rem] text-charcoal/40">
              The first thing visitors see. Keep the title short and evocative.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="heroEyebrow" className="admin-label">
                Eyebrow
              </label>
              <input
                id="heroEyebrow"
                name="heroEyebrow"
                type="text"
                defaultValue={settings.heroEyebrow}
                className="admin-field"
              />
            </div>
            <div>
              <label htmlFor="heroTitle" className="admin-label">
                Hero title <span className="text-gold">*</span>
              </label>
              <input
                id="heroTitle"
                name="heroTitle"
                type="text"
                required
                defaultValue={settings.heroTitle}
                className="admin-field"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="heroDescription" className="admin-label">
                Hero description
              </label>
              <textarea
                id="heroDescription"
                name="heroDescription"
                rows={3}
                defaultValue={settings.heroDescription}
                className="admin-field resize-y"
              />
            </div>
            <div className="sm:col-span-2">
              <ImageField
                label="Hero image"
                name="heroImage"
                defaultValue={settings.heroImage}
                required
                help="Use a wide, atmospheric interior shot (at least 2000px wide)."
              />
            </div>
          </div>
        </section>

        <section className="border border-charcoal/10 bg-cream p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="font-display text-xl text-charcoal">
              Announcement bar
            </h2>
            <p className="mt-1 text-[0.6875rem] text-charcoal/40">
              A short banner across the top of the public website.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="flex items-center gap-2 text-[0.75rem] text-charcoal/70">
                <input
                  type="checkbox"
                  name="announcementEnabled"
                  defaultChecked={settings.announcementEnabled}
                  className="size-4 accent-charcoal"
                />
                Show the announcement bar
              </label>
            </div>
            <div>
              <label htmlFor="announcementText" className="admin-label">
                Message
              </label>
              <input
                id="announcementText"
                name="announcementText"
                type="text"
                defaultValue={settings.announcementText ?? ""}
                placeholder="Now accepting projects for early 2026."
                className="admin-field"
              />
            </div>
            <div>
              <label htmlFor="announcementHref" className="admin-label">
                Link
              </label>
              <input
                id="announcementHref"
                name="announcementHref"
                type="text"
                defaultValue={settings.announcementHref ?? ""}
                placeholder="/contact"
                className="admin-field"
              />
            </div>
          </div>
        </section>

        <section className="border border-charcoal/10 bg-cream p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="font-display text-xl text-charcoal">
              Homepage sections
            </h2>
            <p className="mt-1 text-[0.6875rem] text-charcoal/40">
              Edit the headings and introductions across the home page. Use
              line breaks in titles to control the emphasis.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {[
              {
                key: "homeProjects",
                label: "Selected work",
                eyebrow: settings.homeProjectsEyebrow,
                title: settings.homeProjectsTitle,
                description: settings.homeProjectsDescription,
              },
              {
                key: "homeServices",
                label: "Services",
                eyebrow: settings.homeServicesEyebrow,
                title: settings.homeServicesTitle,
                description: settings.homeServicesDescription,
              },
              {
                key: "homeProducts",
                label: "Collection",
                eyebrow: settings.homeProductsEyebrow,
                title: settings.homeProductsTitle,
                description: settings.homeProductsDescription,
              },
              {
                key: "homeWhy",
                label: "Why choose us",
                eyebrow: settings.homeWhyEyebrow,
                title: settings.homeWhyTitle,
                description: settings.homeWhyDescription,
              },
              {
                key: "homeTestimonials",
                label: "Testimonials",
                eyebrow: settings.homeTestimonialsEyebrow,
                title: settings.homeTestimonialsTitle,
                description: null,
              },
            ].map((section) => (
              <div
                key={section.key}
                className="grid gap-4 border border-charcoal/10 p-4"
              >
                <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.14em] text-charcoal/40">
                  {section.label}
                </p>
                <div>
                  <label
                    htmlFor={`${section.key}Eyebrow`}
                    className="admin-label"
                  >
                    Eyebrow
                  </label>
                  <input
                    id={`${section.key}Eyebrow`}
                    name={`${section.key}Eyebrow`}
                    type="text"
                    defaultValue={section.eyebrow}
                    className="admin-field"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`${section.key}Title`}
                    className="admin-label"
                  >
                    Title
                  </label>
                  <textarea
                    id={`${section.key}Title`}
                    name={`${section.key}Title`}
                    rows={3}
                    defaultValue={section.title}
                    className="admin-field resize-y"
                  />
                </div>
                {section.description !== null && (
                  <div>
                    <label
                      htmlFor={`${section.key}Description`}
                      className="admin-label"
                    >
                      Introduction
                    </label>
                    <textarea
                      id={`${section.key}Description`}
                      name={`${section.key}Description`}
                      rows={3}
                      defaultValue={section.description}
                      className="admin-field resize-y"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-5 border-t border-charcoal/8 pt-6 sm:grid-cols-2">
            <div>
              <label htmlFor="homeCtaEyebrow" className="admin-label">
                Closing call-to-action eyebrow
              </label>
              <input
                id="homeCtaEyebrow"
                name="homeCtaEyebrow"
                type="text"
                defaultValue={settings.homeCtaEyebrow}
                className="admin-field"
              />
            </div>
            <div className="sm:row-span-2">
              <ImageField
                label="Closing call-to-action image"
                name="homeCtaImage"
                defaultValue={settings.homeCtaImage ?? ""}
              />
            </div>
            <div>
              <label htmlFor="homeCtaTitle" className="admin-label">
                Closing call-to-action title
              </label>
              <textarea
                id="homeCtaTitle"
                name="homeCtaTitle"
                rows={3}
                defaultValue={settings.homeCtaTitle}
                className="admin-field resize-y"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="homeCtaDescription" className="admin-label">
                Closing call-to-action description
              </label>
              <textarea
                id="homeCtaDescription"
                name="homeCtaDescription"
                rows={3}
                defaultValue={settings.homeCtaDescription}
                className="admin-field resize-y"
              />
            </div>
          </div>
        </section>

        <section className="border border-charcoal/10 bg-cream p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="font-display text-xl text-charcoal">About the studio</h2>
            <p className="mt-1 text-[0.6875rem] text-charcoal/40">
              Your story, philosophy, founder, and studio numbers.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="aboutStory" className="admin-label">
                About story <span className="text-gold">*</span>
              </label>
              <textarea
                id="aboutStory"
                name="aboutStory"
                required
                rows={9}
                defaultValue={settings.aboutStory}
                className="admin-field resize-y"
              />
              <p className="mt-1.5 text-[0.625rem] text-charcoal/35">
                Separate paragraphs with a blank line.
              </p>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="philosophy" className="admin-label">
                Philosophy <span className="text-gold">*</span>
              </label>
              <textarea
                id="philosophy"
                name="philosophy"
                required
                rows={4}
                defaultValue={settings.philosophy}
                className="admin-field resize-y"
              />
            </div>
            <div>
              <label htmlFor="founderName" className="admin-label">
                Founder name
              </label>
              <input
                id="founderName"
                name="founderName"
                type="text"
                defaultValue={settings.founderName}
                className="admin-field"
              />
            </div>
            <div>
              <label htmlFor="founderRole" className="admin-label">
                Founder role
              </label>
              <input
                id="founderRole"
                name="founderRole"
                type="text"
                defaultValue={settings.founderRole}
                className="admin-field"
              />
            </div>
            <div>
              <label htmlFor="yearsExperience" className="admin-label">
                Years of experience
              </label>
              <input
                id="yearsExperience"
                name="yearsExperience"
                type="number"
                min={0}
                defaultValue={settings.yearsExperience}
                className="admin-field"
              />
            </div>
            <div>
              <label htmlFor="projectsCompleted" className="admin-label">
                Projects completed
              </label>
              <input
                id="projectsCompleted"
                name="projectsCompleted"
                type="number"
                min={0}
                defaultValue={settings.projectsCompleted}
                className="admin-field"
              />
            </div>
            <div>
              <label htmlFor="citiesServed" className="admin-label">
                Cities served
              </label>
              <input
                id="citiesServed"
                name="citiesServed"
                type="number"
                min={0}
                defaultValue={settings.citiesServed}
                className="admin-field"
              />
            </div>
            <div className="sm:col-span-2 grid gap-6 lg:grid-cols-2">
              <ImageField
                label="About image"
                name="aboutImage"
                defaultValue={settings.aboutImage}
                required
              />
              <ImageField
                label="Founder portrait"
                name="founderImage"
                defaultValue={settings.founderImage ?? ""}
              />
            </div>
          </div>
        </section>

        <section className="border border-charcoal/10 bg-cream p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="font-display text-xl text-charcoal">
              Values & reasons to choose you
            </h2>
            <p className="mt-1 text-[0.6875rem] text-charcoal/40">
              One item per line, formatted as{" "}
              <code className="text-charcoal/60">Title | Description</code>.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <label htmlFor="values" className="admin-label">
                Studio values
              </label>
              <textarea
                id="values"
                name="values"
                rows={6}
                defaultValue={values}
                placeholder="Intentional design | Every decision begins with how you live."
                className="admin-field resize-y font-mono text-[0.75rem]"
              />
            </div>
            <div>
              <label htmlFor="whyChooseUs" className="admin-label">
                Why choose us
              </label>
              <textarea
                id="whyChooseUs"
                name="whyChooseUs"
                rows={6}
                defaultValue={whyChooseUs}
                placeholder="One studio, end to end | Design, execution, and styling under one roof."
                className="admin-field resize-y font-mono text-[0.75rem]"
              />
            </div>
          </div>
        </section>

        <section className="border border-charcoal/10 bg-cream p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="font-display text-xl text-charcoal">Team</h2>
            <p className="mt-1 text-[0.6875rem] text-charcoal/40">
              One person per line, formatted as{" "}
              <code className="text-charcoal/60">
                Name | Role | Bio | Image URL
              </code>
              .
            </p>
          </div>

          <label htmlFor="team" className="admin-label">
            Team members
          </label>
          <textarea
            id="team"
            name="team"
            rows={8}
            defaultValue={team}
            placeholder="Ananya Rao | Founder & Principal Designer | ... | https://..."
            className="admin-field resize-y font-mono text-[0.75rem]"
          />
        </section>

        <section className="border border-charcoal/10 bg-cream p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="font-display text-xl text-charcoal">
              Footer & search metadata
            </h2>
            <p className="mt-1 text-[0.6875rem] text-charcoal/40">
              Applies across the website, in browser tabs, and in search
              results.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="footerDescription" className="admin-label">
                Footer description
              </label>
              <textarea
                id="footerDescription"
                name="footerDescription"
                rows={3}
                defaultValue={settings.footerDescription}
                className="admin-field resize-y"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="footerNote" className="admin-label">
                Footer note
              </label>
              <input
                id="footerNote"
                name="footerNote"
                type="text"
                defaultValue={settings.footerNote ?? ""}
                placeholder="Optional line beneath the footer"
                className="admin-field"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="seoTitle" className="admin-label">
                Default SEO title
              </label>
              <input
                id="seoTitle"
                name="seoTitle"
                type="text"
                maxLength={160}
                defaultValue={settings.seoTitle}
                className="admin-field"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="seoDescription" className="admin-label">
                Default meta description
              </label>
              <textarea
                id="seoDescription"
                name="seoDescription"
                rows={3}
                maxLength={320}
                defaultValue={settings.seoDescription}
                className="admin-field resize-y"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="seoKeywords" className="admin-label">
                Keywords
              </label>
              <textarea
                id="seoKeywords"
                name="seoKeywords"
                rows={3}
                defaultValue={settings.seoKeywords.join(", ")}
                className="admin-field resize-y"
              />
              <p className="mt-1.5 text-[0.625rem] text-charcoal/35">
                Separate keywords with commas.
              </p>
            </div>
            <div className="sm:col-span-2">
              <ImageField
                label="Social sharing image"
                name="ogImage"
                defaultValue={settings.ogImage ?? ""}
                help="Used when the site is shared on social media. Leave blank to use the hero image."
              />
            </div>
          </div>
        </section>
      </div>
    </AdminForm>
  );
}
