import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "dark" | "outline" | "light" | "whatsapp" | "text";

const variants: Record<Variant, string> = {
  dark: "bg-charcoal text-ivory hover:bg-ink",
  outline:
    "border border-charcoal/30 text-charcoal hover:border-charcoal hover:bg-charcoal hover:text-ivory",
  light:
    "border border-ivory/30 text-ivory hover:border-ivory hover:bg-ivory hover:text-charcoal",
  whatsapp: "bg-[#1f5c45] text-white hover:bg-[#174936]",
  text: "px-0 py-0 text-charcoal hover:text-gold",
};

const base =
  "group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-none px-6 py-3 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] transition-all duration-300 disabled:pointer-events-none disabled:opacity-50";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  external?: boolean;
  arrow?: boolean;
  whatsapp?: boolean;
  ariaLabel?: string;
};

export function ButtonLink({
  href,
  children,
  variant = "dark",
  className,
  external,
  arrow,
  whatsapp,
  ariaLabel,
}: ButtonLinkProps) {
  const classes = cn(base, variants[variant], className);
  const content = (
    <>
      {whatsapp && <MessageCircle className="size-4" strokeWidth={1.6} />}
      <span>{children}</span>
      {arrow && (
        <ArrowUpRight
          className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          strokeWidth={1.6}
        />
      )}
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} aria-label={ariaLabel}>
      {content}
    </Link>
  );
}

export function Button({
  children,
  variant = "dark",
  className,
  type = "button",
  disabled,
  arrow,
  whatsapp,
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  arrow?: boolean;
  whatsapp?: boolean;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(base, variants[variant], className)}
    >
      {whatsapp && <MessageCircle className="size-4" strokeWidth={1.6} />}
      <span>{children}</span>
      {arrow && (
        <ArrowUpRight
          className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          strokeWidth={1.6}
        />
      )}
    </button>
  );
}
