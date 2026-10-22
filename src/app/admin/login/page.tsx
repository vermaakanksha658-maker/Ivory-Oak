import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getSession } from "@/lib/auth";
import { LoginForm } from "@/components/admin/login-form";
import { Logo } from "@/components/ui/logo";

export const metadata: Metadata = {
  title: "Studio Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await getSession();
  if (session) redirect("/admin");

  const { next } = await searchParams;

  return (
    <div className="grid min-h-screen bg-cream lg:grid-cols-[1.05fr_0.95fr]">
      <div className="relative hidden overflow-hidden bg-charcoal lg:block">
        <Image
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85"
          alt="A warm, considered interior by Ivory & Oak"
          fill
          priority
          sizes="55vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-charcoal/35" />
        <div className="relative flex h-full flex-col justify-between p-10 lg:p-14">
          <Logo theme="light" />
          <div>
            <p className="eyebrow text-beige/70">The studio, behind the scenes</p>
            <p className="mt-5 max-w-lg font-display text-[3.2rem] leading-[1.04] text-ivory">
              Every beautiful space begins with a well-kept story.
            </p>
            <p className="mt-6 max-w-sm text-[0.8125rem] leading-6 text-ivory/55">
              Manage projects, services, the collection, enquiries, and studio
              content from one quiet place.
            </p>
          </div>
          <p className="text-[0.5625rem] uppercase tracking-[0.15em] text-ivory/35">
            Ivory &amp; Oak · Studio content manager
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <div className="lg:hidden">
            <Logo />
          </div>
          <Link
            href="/"
            className="mt-10 inline-flex items-center gap-2 text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-charcoal/40 transition-colors hover:text-charcoal lg:mt-0"
          >
            <ArrowLeft className="size-3.5" strokeWidth={1.5} />
            Back to the website
          </Link>

          <p className="eyebrow mt-10 text-olive">Studio access</p>
          <h1 className="mt-4 text-[2.9rem] leading-[1.02] tracking-[-0.03em] text-charcoal">
            Welcome back.
          </h1>
          <p className="mt-3 text-[0.875rem] leading-6 text-charcoal/50">
            Sign in to manage the Ivory &amp; Oak website.
          </p>

          <LoginForm next={next} />

          <p className="mt-8 border-t border-charcoal/10 pt-6 text-[0.625rem] leading-5 text-charcoal/35">
            This is a private studio area. Access is limited to authorised
            members of the Ivory &amp; Oak team. Admin accounts are created
            through the database seed.
          </p>
        </div>
      </div>
    </div>
  );
}
