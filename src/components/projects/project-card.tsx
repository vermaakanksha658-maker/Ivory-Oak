import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/demo-data";

export function ProjectCard({
  project,
  className,
  imageClassName,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: {
  project: Project;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className={cn("group block", className)}
    >
      <div
        className={cn(
          "image-reveal relative overflow-hidden bg-sand",
          imageClassName ?? "aspect-[4/5]",
        )}
      >
        <Image
          src={project.coverImage}
          alt={`${project.title} — ${project.style} interior in ${project.location}`}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/10" />
        <span className="absolute left-4 top-4 bg-ivory/95 px-3 py-2 text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-charcoal backdrop-blur-sm sm:left-5 sm:top-5">
          {project.category}
        </span>
        <span className="absolute bottom-4 right-4 flex size-10 items-center justify-center bg-ivory text-charcoal opacity-0 transition-all duration-500 group-hover:opacity-100 sm:bottom-5 sm:right-5">
          <ArrowUpRight className="size-4" strokeWidth={1.5} />
        </span>
      </div>
      <div className="flex items-start justify-between gap-5 pt-4">
        <div>
          <h3 className="font-display text-[1.65rem] leading-tight tracking-[-0.02em] text-charcoal transition-colors duration-300 group-hover:text-olive">
            {project.title}
          </h3>
          <p className="mt-1.5 text-[0.6875rem] uppercase tracking-[0.13em] text-charcoal/50">
            {project.location} · {project.style}
          </p>
        </div>
        <span className="pt-2 text-[0.625rem] tabular-nums tracking-[0.14em] text-charcoal/35">
          {project.year}
        </span>
      </div>
    </Link>
  );
}
