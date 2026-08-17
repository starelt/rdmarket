import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RDMarket | El Gran Mercado Local",
  description: "El marketplace de República Dominicana para compras a suplidores y tiendas locales.",
};

import { auth } from "@/auth";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const role = (session?.user as any)?.role;

  return (
    <html lang="es" className={`${outfit.variable}`}>
      <body>
        <nav className="glass navbar">
          <div className="container nav-content">
            <a href="/" className="nav-brand">RDMarket</a>
            <div className="nav-links">
              <a href="/">Catálogo</a>
              <a href="/cart">Carrito (0)</a>
              {role === "ADMIN" ? (
                <a href="/admin" className="btn" style={{ background: "linear-gradient(90deg, #b8860b, #daa520)", color: "white", fontWeight: "bold" }}>👑 Panel Admin</a>
              ) : role === "VENDOR" ? (
                <a href="/vendor/dashboard" className="btn btn-primary">Panel Vendedor</a>
              ) : session ? (
                <a href="/vendor/onboarding" className="btn btn-primary">Vender aquí</a>
              ) : (
                <a href="/login" className="btn btn-primary">Iniciar Sesión</a>
              )}
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
