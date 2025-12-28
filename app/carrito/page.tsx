"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { useCart } from "@/components/cart-context";
import { formatPrice } from "@/lib/format";
import { isAllowedPostalCode } from "@/lib/postal-codes";
import { createOrder } from "@/lib/api";
import { submitRedsysPayment } from "@/lib/redsys";

export default function CarritoPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clear } = useCart();
  const [postalCode, setPostalCode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const total = useMemo(
    () =>
      items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const trimmedPostal = postalCode.trim();
  const isPostalFormatValid = /^\d{5}$/.test(trimmedPostal);
  const isPostalAllowed = isPostalFormatValid
    ? isAllowedPostalCode(trimmedPostal)
    : false;
  const hasItems = items.length > 0;

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid =
    name.trim() !== "" &&
    isEmailValid &&
    phone.trim() !== "" &&
    address.trim() !== "" &&
    city.trim() !== "" &&
    isPostalAllowed &&
    hasItems;

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setIsSubmitting(true);
    setError("");

    try {
      const province = city.toLowerCase().includes("zamora") ? "Zamora" : "Salamanca";
      
      const response = await createOrder({
        customer: {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          address: address.trim(),
          postal_code: trimmedPostal,
          city: city.trim(),
          province,
        },
        items: items.map((item) => ({
          product_slug: item.productSlug,
          product_name: item.name,
          variant_id: item.id,
          variant_name: item.variantName,
          size: item.size,
          quantity: item.quantity,
          unit_price: item.price,
        })),
        notes: notes.trim() || undefined,
      });

      // Clear cart
      clear();
      
      // Redirect to Redsys payment gateway
      submitRedsysPayment(response.payment_form);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al procesar el pedido");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Carrito
        </p>
        <h1 className="font-display text-3xl text-slate-900 md:text-4xl">
          Tu pedido, sin llamadas.
        </h1>
        <p className="max-w-2xl text-base text-slate-600">
          Completa tus datos y confirma el pedido. Recibirás un email de confirmación.
        </p>
      </div>

      {error && (
        <div className="rounded-3xl border border-red-200/60 bg-red-50/80 p-6 shadow-sm">
          <p className="text-sm font-semibold text-red-900">Error</p>
          <p className="mt-1 text-sm text-red-700">{error}</p>
        </div>
      )}

      {!hasItems ? (
        <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-sm">
          <p className="text-sm text-slate-600">
            Aun no has seleccionado productos. Visita el catalogo para empezar.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/catalogo"
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Ir al catalogo
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-sm md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-24 overflow-hidden rounded-2xl bg-slate-50">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-600">{item.variantName}</p>
                    <p className="text-xs text-slate-500">{item.size}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(event) =>
                      updateQuantity(
                        item.id,
                        Math.max(1, Number(event.target.value) || 1)
                      )
                    }
                    className="w-20 rounded-full border border-slate-200 px-3 py-2 text-sm"
                  />
                  <p className="text-sm font-semibold text-slate-900">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                  <button
                    type="button"
                    className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 transition hover:text-slate-600"
                    onClick={() => removeItem(item.id)}
                  >
                    Quitar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6 rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Resumen
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {formatPrice(total)}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Precio final sin opciones adicionales.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Tu nombre"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="tu@email.com"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="600123456"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Dirección *
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="Calle, número, piso"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Ciudad *
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  placeholder="Salamanca o Zamora"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Código postal de entrega *
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={postalCode}
                  onChange={(event) => setPostalCode(event.target.value)}
                  placeholder="Ej: 37005"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                  required
                />
                {!isPostalFormatValid && postalCode.length > 0 ? (
                  <p className="text-xs text-slate-500">
                    Introduce un código postal de 5 dígitos.
                  </p>
                ) : null}
                {isPostalFormatValid && !isPostalAllowed ? (
                  <p className="text-xs text-red-600">
                    Este código postal no está dentro de la zona de entrega.
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Notas adicionales (opcional)
                </label>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Instrucciones especiales para la entrega"
                  rows={3}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              className="w-full rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Procesando..." : "Ir a pago"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
