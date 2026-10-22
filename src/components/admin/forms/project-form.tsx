import { AdminForm } from "@/components/admin/admin-form";
import { ImageField } from "@/components/admin/image-field";
import { GalleryField } from "@/components/admin/gallery-field";
import { saveProject } from "@/app/admin/actions";
import type { Project } from "@/lib/demo-data";

export function ProjectForm({ project }: { project: Project | null }) {
  const gallery = (project?.images ?? [])
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((image) => `${image.url} | ${image.alt}`)
    .join("\n");

  return (
    <AdminForm
      action={saveProject}
      cancelHref="/admin/projects"
      submitLabel={project ? "Save project" : "Create project"}
    >
      {project && <input type="hidden" name="id" value={project.id} />}

      <div className="space-y-6">
        <section className="border border-charcoal/10 bg-cream p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="font-display text-xl text-charcoal">
              Project details
            </h2>
            <p className="mt-1 text-[0.6875rem] text-charcoal/40">
              The essentials shown across the portfolio.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="title" className="admin-label">
                Project title <span className="text-gold">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                defaultValue={project?.title ?? ""}
                placeholder="e.g. The Quiet House"
                className="admin-field"
              />
            </div>

            <div>
              <label htmlFor="slug" className="admin-label">
                URL slug
              </label>
              <input
                id="slug"
                name="slug"
                type="text"
                defaultValue={project?.slug ?? ""}
                placeholder="auto-generated-from-title"
                className="admin-field"
              />
            </div>

            <div>
              <label htmlFor="subtitle" className="admin-label">
                Subtitle
              </label>
              <input
                id="subtitle"
                name="subtitle"
                type="text"
                defaultValue={project?.subtitle ?? ""}
                placeholder="e.g. A serene 4BHK in Jubilee Hills"
                className="admin-field"
              />
            </div>

            <div>
              <label htmlFor="category" className="admin-label">
                Category <span className="text-gold">*</span>
              </label>
              <input
                id="category"
                name="category"
                type="text"
                required
                list="project-categories"
                defaultValue={project?.category ?? "Residential"}
                className="admin-field"
              />
              <datalist id="project-categories">
                <option value="Residential" />
                <option value="Apartment" />
                <option value="Kitchen" />
                <option value="Bedroom" />
                <option value="Living" />
                <option value="Commercial" />
              </datalist>
            </div>

            <div>
              <label htmlFor="location" className="admin-label">
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                defaultValue={project?.location ?? ""}
                placeholder="Hyderabad"
                className="admin-field"
              />
            </div>

            <div>
              <label htmlFor="style" className="admin-label">
                Design style
              </label>
              <input
                id="style"
                name="style"
                type="text"
                defaultValue={project?.style ?? ""}
                placeholder="Warm minimal"
                className="admin-field"
              />
            </div>

            <div>
              <label htmlFor="year" className="admin-label">
                Year
              </label>
              <input
                id="year"
                name="year"
                type="text"
                defaultValue={project?.year ?? ""}
                placeholder="2025"
                className="admin-field"
              />
            </div>

            <div>
              <label htmlFor="sortOrder" className="admin-label">
                Sort order
              </label>
              <input
                id="sortOrder"
                name="sortOrder"
                type="number"
                min={0}
                defaultValue={project?.sortOrder ?? 0}
                className="admin-field"
              />
              <p className="mt-1.5 text-[0.625rem] text-charcoal/35">
                Lower numbers appear first in the portfolio.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-5 border-t border-charcoal/8 pt-5">
            <label className="flex items-center gap-2 text-[0.75rem] text-charcoal/70">
              <input
                type="checkbox"
                name="published"
                defaultChecked={project?.published ?? true}
                className="size-4 accent-charcoal"
              />
              Published on the website
            </label>
            <label className="flex items-center gap-2 text-[0.75rem] text-charcoal/70">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={project?.featured ?? false}
                className="size-4 accent-charcoal"
              />
              Feature on the home page
            </label>
          </div>
        </section>

        <section className="border border-charcoal/10 bg-cream p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="font-display text-xl text-charcoal">The story</h2>
            <p className="mt-1 text-[0.6875rem] text-charcoal/40">
              Write in a warm, editorial voice. Line breaks are preserved.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="description" className="admin-label">
                Short description <span className="text-gold">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={3}
                defaultValue={project?.description ?? ""}
                placeholder="A one or two sentence summary used on cards..."
                className="admin-field resize-y"
              />
            </div>
            <div>
              <label htmlFor="story" className="admin-label">
                Full project story <span className="text-gold">*</span>
              </label>
              <textarea
                id="story"
                name="story"
                required
                rows={8}
                defaultValue={project?.story ?? ""}
                placeholder="Tell the story of the space, the brief, the materials, and the outcome..."
                className="admin-field resize-y"
              />
            </div>
          </div>
        </section>

        <section className="border border-charcoal/10 bg-cream p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="font-display text-xl text-charcoal">
              Search appearance
            </h2>
            <p className="mt-1 text-[0.6875rem] text-charcoal/40">
              Leave blank to use the project title and description.
            </p>
          </div>

          <div className="grid gap-5">
            <div>
              <label htmlFor="seoTitle" className="admin-label">
                SEO title
              </label>
              <input
                id="seoTitle"
                name="seoTitle"
                type="text"
                maxLength={160}
                defaultValue={project?.seoTitle ?? ""}
                className="admin-field"
              />
            </div>
            <div>
              <label htmlFor="seoDescription" className="admin-label">
                Meta description
              </label>
              <textarea
                id="seoDescription"
                name="seoDescription"
                rows={3}
                maxLength={320}
                defaultValue={project?.seoDescription ?? ""}
                className="admin-field resize-y"
              />
            </div>
            <ImageField
              label="Social sharing image"
              name="ogImage"
              defaultValue={project?.ogImage ?? ""}
              help="Optional. Leave blank to use the cover image."
            />
          </div>
        </section>

        <section className="border border-charcoal/10 bg-cream p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="font-display text-xl text-charcoal">Imagery</h2>
            <p className="mt-1 text-[0.6875rem] text-charcoal/40">
              Use your best wide shot as the cover. Upload to Cloudinary or
              paste a hosted image URL.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="lg:col-span-2">
              <ImageField
                label="Cover image"
                name="coverImage"
                defaultValue={project?.coverImage ?? ""}
                required
                help="Shown on portfolio cards and at the top of the project page."
              />
            </div>
            <ImageField
              label="Before image"
              name="beforeImage"
              defaultValue={project?.beforeImage ?? ""}
              help="Optional. Enables the before-and-after slider."
            />
            <ImageField
              label="After image"
              name="afterImage"
              defaultValue={project?.afterImage ?? ""}
              help="Optional. Use the same crop as the before image."
            />
          </div>

          <div className="mt-6 border-t border-charcoal/8 pt-6">
            <GalleryField
              label="Project gallery"
              name="images"
              defaultValue={gallery}
              defaultAlt={project?.title ?? ""}
              help="Add multiple images, then use the arrows to set their order. The first image appears first in the gallery."
            />
          </div>
        </section>
      </div>
    </AdminForm>
  );
}
