import ProductCard from "@/components/product-card";
import { products } from "@/data/products";

export default function CatalogoPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Catalogo
        </p>
        <h1 className="font-display text-3xl text-slate-900 md:text-4xl">
          Productos claros, sin dudas.
        </h1>
        <p className="max-w-2xl text-base text-slate-600">
          Solo lo esencial: colchones, canapes y camas articuladas con entrega
          propia. Sin opciones infinitas ni llamadas.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
