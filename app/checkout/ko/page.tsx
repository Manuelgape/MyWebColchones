"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CheckoutKoPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="space-y-8">
      <div className="space-y-3 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-10 w-10 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h1 className="font-display text-3xl text-slate-900 md:text-4xl">
          Pago cancelado
        </h1>
        <p className="max-w-2xl mx-auto text-base text-slate-600">
          El pago no se ha completado. No se ha realizado ningún cargo.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-sm max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold text-slate-900">
          ¿Qué ha pasado?
        </h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-600">
          <li>El pago fue cancelado o rechazado</li>
          <li>No se ha realizado ningún cargo en tu cuenta</li>
          <li>Tu pedido no ha sido procesado</li>
        </ul>

        <h2 className="mt-6 text-xl font-semibold text-slate-900">
          ¿Qué puedes hacer?
        </h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-600">
          <li>Revisar los datos de tu tarjeta</li>
          <li>Intentar el pago nuevamente</li>
          <li>Contactarnos si el problema persiste</li>
        </ul>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          href="/carrito"
          className="rounded-full bg-[#2fb4ad] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#279c95]"
        >
          Volver al carrito
        </Link>
        <Link
          href="/contacto"
          className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
        >
          Contactar
        </Link>
      </div>

      {orderId && (
        <p className="text-center text-xs text-slate-400">
          Referencia: {orderId}
        </p>
      )}
    </div>
  );
}
