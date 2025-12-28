"use client";

import type { ReactNode } from "react";

import { CartProvider } from "@/components/cart-context";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
