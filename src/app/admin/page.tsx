import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // 1. Obtener todos los items vendidos
  const orderItems = await prisma.orderItem.findMany({
    include: {
      store: true,
      order: true
    }
  });

  // 2. Calcular estadísticas globales
  let globalSales = 0;
  let globalCommission = 0; // 10% de las ventas

  // 3. Agrupar por tienda para la tabla de liquidación
  const storeStats: Record<string, { storeName: string, totalSales: number, commissionDebt: number }> = {};

  orderItems.forEach(item => {
    // Solo contar si la orden no está cancelada
    if (item.order.status !== "CANCELLED") {
      const itemTotal = item.price * item.quantity;
      const commission = itemTotal * 0.10; // 10% para RDMarket

      globalSales += itemTotal;
      globalCommission += commission;

      if (!storeStats[item.storeId]) {
        storeStats[item.storeId] = {
          storeName: item.store.name,
          totalSales: 0,
          commissionDebt: 0
        };
      }

      storeStats[item.storeId].totalSales += itemTotal;
      storeStats[item.storeId].commissionDebt += commission;
    }
  });

  const leaderBoard = Object.values(storeStats).sort((a, b) => b.totalSales - a.totalSales);

  // Datos simulados en caso de que la BD esté vacía para propósitos de demostración UI
  const isDBEmpty = leaderBoard.length === 0;
  const displaySales = isDBEmpty ? 150000 : globalSales;
  const displayCommission = isDBEmpty ? 15000 : globalCommission;
  const displayLeaderBoard = isDBEmpty ? [
    { storeName: "ElectroMundo RD", totalSales: 80000, commissionDebt: 8000 },
    { storeName: "Apple Store Local", totalSales: 50000, commissionDebt: 5000 },
    { storeName: "Gaming PC Center", totalSales: 20000, commissionDebt: 2000 },
  ] : leaderBoard;

  return (
    <div className="animate-fade-in-up">
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem" }}>📊 Dashboard Financiero</h1>

      {/* Tarjetas de Métricas Globales */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "3rem" }}>
        <div style={{ background: "linear-gradient(135deg, var(--card-bg), #111)", padding: "2rem", borderRadius: "16px", border: "1px solid var(--border)" }}>
          <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", marginBottom: "0.5rem" }}>Ventas Globales (Todas las Tiendas)</p>
          <h2 style={{ fontSize: "3rem", color: "white", margin: 0 }}>RD$ {displaySales.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</h2>
        </div>

        <div style={{ background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))", padding: "2rem", borderRadius: "16px", border: "1px solid #10b981" }}>
          <p style={{ color: "#10b981", fontSize: "1.1rem", marginBottom: "0.5rem", fontWeight: "bold" }}>Ganancias RDMarket (Comisión 10%)</p>
          <h2 style={{ fontSize: "3rem", color: "#10b981", margin: 0 }}>RD$ {displayCommission.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "1rem" }}>Este es el dinero que las tiendas le deben a la plataforma.</p>
        </div>
      </div>

      {/* Tabla de Liquidación por Tienda */}
      <div className="glass" style={{ padding: "2rem", borderRadius: "16px" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>Liquidación de Tiendas</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)" }}>
              <th style={{ padding: "1rem 0" }}>Nombre de la Tienda</th>
              <th>Ventas Brutas</th>
              <th>Ganancia Tienda (90%)</th>
              <th style={{ color: "#10b981" }}>Deuda con RDMarket (10%)</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {displayLeaderBoard.map((store, idx) => (
              <tr key={idx} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <td style={{ padding: "1rem 0", fontWeight: "bold" }}>{store.storeName}</td>
                <td style={{ color: "white" }}>RD$ {store.totalSales.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</td>
                <td style={{ color: "var(--primary)" }}>RD$ {(store.totalSales * 0.90).toLocaleString('es-DO', { minimumFractionDigits: 2 })}</td>
                <td style={{ color: "#10b981", fontWeight: "bold" }}>RD$ {store.commissionDebt.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</td>
                <td>
                  <button style={{ background: "transparent", border: "1px solid #10b981", color: "#10b981", padding: "0.4rem 0.8rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem" }}>
                    Marcar Pagado
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
