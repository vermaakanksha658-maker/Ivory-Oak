import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/demo-data";
import { formatPrice } from "@/lib/utils";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="image-reveal relative aspect-[4/5] overflow-hidden bg-cream">
        <Image
          src={product.coverImage}
          alt={`${product.name} — ${product.category}`}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
        />
        <span className="absolute left-4 top-4 bg-ivory/95 px-2.5 py-1.5 text-[0.5625rem] font-semibold uppercase tracking-[0.14em] text-charcoal/70 opacity-0 transition-opacity duration-400 group-hover:opacity-100">
          {product.category}
        </span>
        <span className="absolute bottom-4 right-4 flex size-9 items-center justify-center bg-ivory text-charcoal opacity-0 transition-all duration-400 group-hover:opacity-100">
          <ArrowUpRight className="size-4" strokeWidth={1.5} />
        </span>
      </div>
      <div className="border-b border-charcoal/10 pt-4 pb-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.15em] text-taupe">
              {product.category}
            </p>
            <h3 className="mt-1.5 font-display text-[1.35rem] leading-none text-charcoal transition-colors duration-300 group-hover:text-olive">
              {product.name}
            </h3>
          </div>
          <p className="shrink-0 pt-1 text-[0.75rem] font-medium text-charcoal/70">
            {product.priceOnRequest || product.price === null
              ? "Price on request"
              : formatPrice(product.price)}
          </p>
        </div>
      </div>
    </Link>
  );
}
