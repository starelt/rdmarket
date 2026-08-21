export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f2f2f2" }}>
      {/* Sidebar Admin */}
      <aside style={{ width: "280px", background: "white", borderRight: "1px solid #e5e7eb", padding: "2rem", boxShadow: "2px 0 10px rgba(0,0,0,0.05)" }}>
        <h2 style={{ fontSize: "1.5rem", color: "#111", marginBottom: "2rem", fontWeight: "900" }}>
          <span style={{ color: "#ff4747" }}>RDMarket</span><br/>Admin
        </h2>
        <nav style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <a href="/admin" style={{ color: "#4b5563", textDecoration: "none", fontSize: "1.05rem", fontWeight: "bold" }}>📊 Dashboard</a>
          <a href="/admin/verifications" style={{ color: "#4b5563", textDecoration: "none", fontSize: "1.05rem", fontWeight: "bold" }}>🔍 Solicitudes KYC</a>
          <a href="/admin/users" style={{ color: "#ff4747", textDecoration: "none", fontSize: "1.05rem", fontWeight: "bold", background: "#fff1f1", padding: "10px", borderRadius: "8px" }}>👥 Usuarios y Tiendas</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "2rem" }}>
        {children}
      </main>
    </div>
  );
}
