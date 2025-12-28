import Link from "next/link";

import ProductCard from "@/components/product-card";
import { products } from "@/data/products";

export default function Home() {
  const featured = products.slice(0, 3);

  return (
    <div className="space-y-16">
      <section className="grid items-center gap-10">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Especialistas en descanso
          </p>
          <h1 className="font-display text-4xl leading-tight text-slate-900 md:text-5xl">
            Colchón premium, entrega sin intermediarios.
          </h1>
          <p className="text-lg text-slate-600">
            Montamos en tu casa con equipo propio. Pago online seguro y soporte local.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/catalogo"
              className="rounded-full bg-[#2fb4ad] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#279c95]"
            >
              Comprar ahora
            </Link>
            <Link
              href="/condiciones"
              className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
            >
              Ver cómo trabajamos
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">
            Catalogo esencial
          </h2>
          <Link
            href="/catalogo"
            className="text-sm font-semibold text-slate-700 transition hover:text-slate-900"
          >
            Ver todo
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-sm">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <p className="text-sm font-semibold text-slate-500">Paso 1</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">
              Elige producto y medida
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Catalogo corto con opciones claras para decidir rapido.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Paso 2</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">
              Comprueba tu codigo postal
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Solo entregamos en Salamanca y Zamora con equipo propio.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Paso 3</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">
              Pagas online y listo
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Confirmacion por email y entrega en el plazo indicado.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
