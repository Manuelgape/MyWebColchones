"use client";

import { useMemo, useState } from "react";

import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/format";

import { useCart } from "@/components/cart-context";

type AddToCartProps = {
  product: Product;
};

export default function AddToCart({ product }: AddToCartProps) {
  const { addItem } = useCart();
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "");
  const [added, setAdded] = useState(false);

  const selectedVariant = useMemo(
    () => product.variants.find((variant) => variant.id === variantId),
    [product.variants, variantId]
  );

  const handleAdd = () => {
    if (!selectedVariant) {
      return;
    }

    addItem({
      id: `${product.slug}-${selectedVariant.id}`,
      productSlug: product.slug,
      name: product.name,
      variantName: selectedVariant.name,
      size: selectedVariant.size,
      price: selectedVariant.price,
      image: product.images[0]?.src ?? "",
      quantity: 1,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {product.variants.map((variant) => (
          <label
            key={variant.id}
            className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/60 bg-white px-4 py-3 text-sm"
          >
            <div>
              <p className="font-semibold text-slate-900">{variant.name}</p>
              <p className="text-slate-600">{variant.size}</p>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-semibold text-slate-900">
                {formatPrice(variant.price)}
              </p>
              <input
                type="radio"
                name="variant"
                value={variant.id}
                checked={variantId === variant.id}
                onChange={() => setVariantId(variant.id)}
              />
            </div>
          </label>
        ))}
      </div>

      <button
        type="button"
        className={`w-full rounded-full px-6 py-3 text-sm font-semibold text-white transition ${
          added
            ? "bg-green-600 hover:bg-green-700"
            : "bg-slate-900 hover:bg-slate-800"
        }`}
        onClick={handleAdd}
        disabled={!selectedVariant}
      >
        {added ? "✓ Añadido al carrito" : "Añadir al carrito"}
      </button>
      {selectedVariant ? (
        <p className="text-xs text-slate-500">
          Precio seleccionado: {formatPrice(selectedVariant.price)}
        </p>
      ) : null}
    </div>
  );
}
