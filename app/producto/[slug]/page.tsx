import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import AddToCart from "@/components/add-to-cart";
import { products, getProductBySlug } from "@/data/products";

type ProductPageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-10">
      <Link href="/catalogo" className="text-sm font-semibold text-slate-600">
        ← Volver al catalogo
      </Link>

      <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-white/80 shadow-sm">
            <Image
              src={product.images[0].src}
              alt={product.images[0].alt}
              fill
              className="object-cover"
            />
          </div>
          <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Lo que incluye
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {product.included.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
            <h2 className="mt-6 text-lg font-semibold text-slate-900">
              Lo que no incluye
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {product.notIncluded.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              {product.leadTime}
            </p>
            <h1 className="font-display text-3xl text-slate-900 md:text-4xl">
              {product.name}
            </h1>
            <p className="mt-3 text-base text-slate-600">
              {product.description}
            </p>
            <p className="mt-3 text-sm text-slate-600">
              {product.longDescription}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Medidas y precio
            </h2>
            <div className="mt-4">
              <AddToCart product={product} />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Detalles clave
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {product.highlights.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

