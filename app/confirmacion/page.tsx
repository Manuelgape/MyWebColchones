"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ConfirmacionContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="space-y-3 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
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
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Pedido confirmado
        </p>
        <h1 className="font-display text-3xl text-slate-900 md:text-4xl">
          ¡Gracias por tu pedido!
        </h1>
        {orderNumber && (
          <p className="text-lg text-slate-600">
            Número de pedido:{" "}
            <span className="font-semibold text-slate-900">{orderNumber}</span>
          </p>
        )}
      </div>

      <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">
          ¿Qué sucede ahora?
        </h2>
        <div className="mt-6 space-y-4">
          <div className="flex gap-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
              1
            </div>
            <div>
              <p className="font-semibold text-slate-900">
                Confirmación por email
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Hemos enviado los detalles de tu pedido a tu correo electrónico.
                Revisa también la carpeta de spam.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
              2
            </div>
            <div>
              <p className="font-semibold text-slate-900">
                Preparación del pedido
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Nuestro equipo preparará tu pedido según el plazo indicado en
                cada producto.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
              3
            </div>
            <div>
              <p className="font-semibold text-slate-900">
                Entrega a domicilio
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Te contactaremos para coordinar la entrega en Salamanca o Zamora.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900">Información importante</h3>
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          <li>• Entrega solo en Salamanca y Zamora</li>
          <li>• No retiramos el colchón antiguo</li>
          <li>• Si tienes dudas, contacta a hola@agustindescanso.es</li>
        </ul>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
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
          Ver más productos
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmacionPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl space-y-8 text-center">
          <p className="text-slate-600">Cargando...</p>
        </div>
      }
    >
      <ConfirmacionContent />
    </Suspense>
  );
}
