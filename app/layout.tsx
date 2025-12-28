import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";

import ClientProviders from "@/components/client-providers";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import "./globals.css";

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

const displayFont = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agustin Descanso | Colchones online en Salamanca y Zamora",
  description:
    "Colchones, canapes y camas articuladas con entrega propia en Salamanca y Zamora. Pago 100% online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${bodyFont.variable} ${displayFont.variable} font-body antialiased`}
      >
        <ClientProviders>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-16 pt-10">
              {children}
            </main>
            <SiteFooter />
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
