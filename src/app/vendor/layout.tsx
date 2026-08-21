import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function VendorLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if ((session.user as any).role !== "VENDOR") {
    redirect("/");
  }

  return (
    <div style={{ display: "flex", minHeight: "80vh" }}>
      {/* Sidebar */}
      <aside className="glass" style={{ width: "250px", padding: "2rem 1rem", borderRight: "1px solid var(--border)", borderRadius: "0 16px 16px 0", marginTop: "2rem" }}>
        <h2 style={{ marginBottom: "2rem", paddingLeft: "1rem", fontSize: "1.5rem" }}>💼 Mi Tienda</h2>
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <Link href="/vendor/dashboard" className="btn" style={{ justifyContent: "flex-start", background: "var(--secondary)", border: "1px solid var(--border)" }}>📊 Resumen</Link>
          <Link href="/vendor/products" className="btn" style={{ justifyContent: "flex-start", background: "transparent" }}>📦 Inventario</Link>
          <Link href="/vendor/orders" className="btn" style={{ justifyContent: "flex-start", background: "transparent" }}>📝 Órdenes</Link>
          <Link href="/vendor/accounting" className="btn" style={{ justifyContent: "flex-start", background: "transparent" }}>💰 Contabilidad</Link>
          <Link href="/vendor/settings" className="btn" style={{ justifyContent: "flex-start", background: "transparent", marginTop: "1rem", color: "var(--primary)" }}>⚙️ Perfil y Configuración</Link>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main style={{ flex: 1, padding: "2rem 3rem" }}>
        {children}
      </main>
    </div>
  );
}
