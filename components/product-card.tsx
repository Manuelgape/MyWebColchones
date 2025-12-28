import Image from "next/image";
import Link from "next/link";

import { formatPrice } from "@/lib/format";
import type { Product } from "@/data/products";

function getStartingPrice(product: Product) {
  return Math.min(...product.variants.map((variant) => variant.price));
}

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const startingPrice = getStartingPrice(product);

  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200/60 bg-white/80 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <Link href={`/producto/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] bg-slate-50">
          <Image
            src={product.images[0].src}
            alt={product.images[0].alt}
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-2 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {product.leadTime}
          </p>
          <h3 className="text-lg font-semibold text-slate-900">
            {product.name}
          </h3>
          <p className="text-sm text-slate-600">{product.description}</p>
          <p className="text-sm font-semibold text-slate-900">
            Desde {formatPrice(startingPrice)}
          </p>
        </div>
      </Link>
    </article>
  );
}
