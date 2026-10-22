import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

export function PageIntro({
  eyebrow,
  title,
  intro,
  aside,
  breadcrumbs,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  aside?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("border-b border-charcoal/10 bg-cream", className)}>
      <Container className="pb-14 pt-14 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-24">
        {breadcrumbs && <div className="mb-10">{breadcrumbs}</div>}
        <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
          <div>
            <Reveal>
              <p className="eyebrow flex items-center gap-3 text-olive">
                <span className="h-px w-7 bg-taupe" />
                {eyebrow}
              </p>
              <h1 className="text-balance mt-6 max-w-4xl text-[3.2rem] leading-[0.94] tracking-[-0.04em] text-charcoal sm:text-[4.6rem] lg:text-[5.6rem]">
                {title}
              </h1>
            </Reveal>
          </div>
          <Reveal delay={120}>
            {aside ?? (
              intro && (
                <p className="text-pretty max-w-md text-[0.9375rem] leading-7 text-charcoal/60 lg:pb-2">
                  {intro}
                </p>
              )
            )}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
