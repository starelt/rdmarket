export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar Admin */}
      <aside style={{ width: "280px", background: "#111", borderRight: "1px solid #333", padding: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", color: "white", marginBottom: "2rem" }}>🛡️ RDMarket Admin</h2>
        <nav style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <a href="/admin" style={{ color: "var(--foreground-muted)", textDecoration: "none", fontSize: "1.1rem" }}>📊 Dashboard</a>
          <a href="/admin/verifications" style={{ color: "var(--primary)", textDecoration: "none", fontSize: "1.1rem", fontWeight: "bold" }}>🔍 Solicitudes KYC</a>
          <a href="/admin/users" style={{ color: "var(--foreground-muted)", textDecoration: "none", fontSize: "1.1rem" }}>👥 Usuarios y Tiendas</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "2rem", background: "var(--background)" }}>
        {children}
      </main>
    </div>
  );
}
