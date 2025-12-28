import Link from "next/link";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/60 bg-white/80">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-10 text-sm text-slate-600 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Agustin Descanso
          </p>
          <p>
            Venta online de colchones, canapes y camas articuladas con entrega
            propia en Salamanca y Zamora.
          </p>
          <p className="text-xs text-slate-400">? {year} Agustin Descanso</p>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Enlaces
          </p>
          <Link href="/catalogo" className="block hover:text-slate-900">
            Catalogo
          </Link>
          <Link href="/condiciones" className="block hover:text-slate-900">
            Como funciona
          </Link>
          <Link href="/contacto" className="block hover:text-slate-900">
            Contacto
          </Link>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Soporte
          </p>
          <p>hola@agustindescanso.es</p>
          <p>Lunes a viernes, 9:00 a 18:00</p>
        </div>
      </div>
    </footer>
  );
}
