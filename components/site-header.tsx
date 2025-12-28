import Image from "next/image";
import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-slate-200/60 bg-white/80">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.svg"
            alt="Tu Mejor Sueño"
            width={170}
            height={72}
            priority
            className="h-12 w-auto"
          />
        </Link>
        <nav className="flex flex-wrap items-center gap-6 text-sm font-semibold text-slate-600">
          <Link href="/catalogo" className="transition hover:text-slate-900">
            Catalogo
          </Link>
          <Link href="/condiciones" className="transition hover:text-slate-900">
            Como funciona
          </Link>
          <Link href="/contacto" className="transition hover:text-slate-900">
            Contacto
          </Link>
          <Link
            href="/carrito"
            className="rounded-full border border-slate-300 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-700 transition hover:border-slate-400"
          >
            Carrito
          </Link>
        </nav>
      </div>
    </header>
  );
}
