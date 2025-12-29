"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutOkPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Clear cart on successful payment
    if (typeof window !== "undefined") {
      localStorage.removeItem("mywebcolchones-cart");
    }
  }, []);

  const copyOrderId = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-10 w-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="font-display text-3xl text-slate-900 md:text-4xl">
          ¡Pago confirmado!
        </h1>
        <p className="max-w-2xl mx-auto text-base text-slate-600">
          Tu pedido ha sido procesado correctamente. Recibirás un email de
          confirmación en los próximos minutos.
        </p>
      </div>

      {orderId && (
        <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-sm max-w-2xl mx-auto">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-[0.2em]">
            Número de pedido
          </p>
          <div className="mt-2 flex items-center justify-between gap-4">
            <p className="font-mono text-lg text-slate-900">{orderId}</p>
            <button
              type="button"
              onClick={copyOrderId}
              className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400"
            >
              {copied ? "✓ Copiado" : "Copiar"}
            </button>
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-sm max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold text-slate-900">
          ¿Qué sigue ahora?
        </h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-600">
          <li>✓ Recibirás un email con los detalles del pedido</li>
          <li>✓ Nos pondremos en contacto contigo para coordinar la entrega</li>
          <li>✓ La entrega se realizará en Salamanca o Zamora según indicaste</li>
        </ul>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          href="/"
          className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Volver al inicio
        </Link>
        <Link
          href="/catalogo"
          className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
        >
          Ver catálogo
        </Link>
      </div>
    </div>
  );
}
