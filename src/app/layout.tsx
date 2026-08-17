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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${outfit.variable}`}>
      <body>
        <nav className="glass navbar">
          <div className="container nav-content">
            <a href="/" className="nav-brand">RDMarket</a>
            <div className="nav-links">
              <a href="/">Catálogo</a>
              <a href="/cart">Carrito (0)</a>
              <a href="/vendor/dashboard" className="btn btn-primary">Vender aquí</a>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
