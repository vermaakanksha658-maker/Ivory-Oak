import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center bg-cream">
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="eyebrow text-olive">404</p>
        <h1 className="mt-5 text-5xl text-charcoal">This room doesn&apos;t exist.</h1>
        <p className="mt-4 text-sm leading-7 text-charcoal/60">
          The page you are looking for may have moved, or the link may be out of date.
        </p>
        <Link href="/" className="mt-8 inline-flex h-12 items-center bg-charcoal px-6 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-ivory">
          Return home
        </Link>
      </div>
    </section>
  );
}
