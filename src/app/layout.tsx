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
        <nav className="glass navbar" style={{ background: "white", borderRadius: 0, borderBottom: "2px solid var(--primary)", padding: "15px 0" }}>
          <div className="container nav-content" style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "2rem", alignItems: "center" }}>
            <a href="/" className="nav-brand" style={{ fontSize: "2rem", letterSpacing: "-1px" }}>RDMarket</a>
            
            <div style={{ display: "flex", width: "100%", maxWidth: "800px", margin: "0 auto", border: "2px solid var(--primary)", borderRadius: "30px", overflow: "hidden" }}>
              <input type="text" placeholder="Iphone 15, Zapatos, Laptops..." style={{ flex: 1, padding: "12px 20px", border: "none", outline: "none", fontSize: "1rem" }} />
              <button style={{ background: "var(--primary)", color: "white", padding: "0 30px", border: "none", fontWeight: "bold", fontSize: "1rem", cursor: "pointer" }}>Buscar</button>
            </div>

            <div className="nav-links" style={{ gap: "1rem" }}>
              <a href="/cart" style={{ display: "flex", flexDirection: "column", alignItems: "center", fontSize: "0.8rem", color: "var(--text-color)", textDecoration: "none" }}>
                <span style={{ fontSize: "1.5rem" }}>🛒</span>
                <span style={{ fontWeight: "bold" }}>Carrito</span>
              </a>
              
              {role === "ADMIN" ? (
                <a href="/admin" className="btn" style={{ background: "linear-gradient(90deg, #b8860b, #daa520)", color: "white", fontWeight: "bold", padding: "0.6rem 1.2rem", borderRadius: "20px" }}>👑 Admin</a>
              ) : role === "VENDOR" ? (
                <a href="/vendor/dashboard" className="btn btn-primary" style={{ padding: "0.6rem 1.2rem", borderRadius: "20px" }}>Vendedor</a>
              ) : session ? (
                <a href="/vendor/onboarding" className="btn btn-primary" style={{ padding: "0.6rem 1.2rem", borderRadius: "20px", background: "var(--accent)" }}>Vender</a>
              ) : (
                <a href="/login" className="btn btn-primary" style={{ padding: "0.6rem 1.2rem", borderRadius: "20px" }}>Entrar</a>
              )}
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
