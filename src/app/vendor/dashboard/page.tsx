import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function VendorDashboard() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const store = await prisma.store.findFirst({
    where: { ownerId: session.user.id }
  });

  if (!store) {
    return (
      <div className="container" style={{ padding: "4rem 20px", textAlign: "center" }}>
        <h2>Debes configurar tu tienda primero.</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>Antes de poder ver tu resumen de ventas, debes registrar legalmente tu tienda.</p>
        <a href="/vendor/onboarding" className="btn btn-primary" style={{ padding: "1rem 2rem", textDecoration: "none" }}>
          Ir a Configurar Mi Tienda
        </a>
      </div>
    );
  }

  // Fetch real data
  const productsCount = await prisma.product.count({
    where: { storeId: store.id, isActive: true }
  });

  const orderItems = await prisma.orderItem.findMany({
    where: { storeId: store.id },
    include: { order: { include: { buyer: true } }, product: true },
    orderBy: { order: { createdAt: "desc" } }
  });

  let totalSales = 0;
  let totalProfit = 0; // Ventas - comisiones - costo neto - impuestos
  let pendingOrdersCount = 0;

  const recentOrdersMap = new Map();

  orderItems.forEach(item => {
    const p = item.product;
    const order = item.order;

    if (order.status !== "CANCELLED") {
      // Calculos financieros (simplificados para el mes/histórico)
      if (p) {
        const netCost = (p.netCost || 0) * item.quantity;
        const basePriceTotal = p.basePrice * item.quantity;
        const platformFee = basePriceTotal * 0.10;
        const taxAmount = (basePriceTotal + platformFee) * p.taxRate;
        const finalSalePrice = basePriceTotal + platformFee + taxAmount;

        totalSales += finalSalePrice;
        totalProfit += (finalSalePrice - netCost - platformFee - taxAmount);
      }

      if (order.status === "PENDING" || order.status === "PROCESSING") {
        pendingOrdersCount += 1; // Simplificación: si tiene un item pendiente, sumamos la orden como pendiente
      }
    }

    // Agrupar órdenes recientes para la tabla
    if (!recentOrdersMap.has(order.id)) {
      recentOrdersMap.set(order.id, {
        id: order.id.slice(-6).toUpperCase(), // ID corto
        rawId: order.id,
        buyerName: order.buyer.name || "Usuario",
        createdAt: order.createdAt,
        status: order.status,
        total: 0 // Lo sumaremos ahora
      });
    }
    
    if (p) {
       const finalPrice = (p.basePrice * item.quantity) * 1.10 * (1 + p.taxRate);
       recentOrdersMap.get(order.id).total += finalPrice;
    }
  });

  const recentOrders = Array.from(recentOrdersMap.values()).slice(0, 5); // Solo las últimas 5

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return { bg: "var(--accent)", color: "#000", label: "Pendiente" };
      case "SHIPPED": return { bg: "var(--primary)", color: "#fff", label: "Despachado" };
      case "DELIVERED": return { bg: "#10b981", color: "#fff", label: "Entregado" };
      case "CANCELLED": return { bg: "#ef4444", color: "#fff", label: "Cancelado" };
      default: return { bg: "gray", color: "#fff", label: status };
    }
  };

  return (
    <div className="animate-fade-in-up">
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem" }}>📊 Resumen de tu Tienda</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        <div className="glass" style={{ padding: "1.5rem", borderRadius: "16px", textAlign: "center" }}>
          <h3 style={{ color: "var(--text-muted)", fontSize: "1rem", marginBottom: "0.5rem" }}>Ventas Totales</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--primary)" }}>RD$ {totalSales.toLocaleString('es-DO', { minimumFractionDigits: 0 })}</p>
        </div>
        <div className="glass" style={{ padding: "1.5rem", borderRadius: "16px", textAlign: "center" }}>
          <h3 style={{ color: "var(--text-muted)", fontSize: "1rem", marginBottom: "0.5rem" }}>Órdenes Pendientes</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--accent)" }}>{pendingOrdersCount}</p>
        </div>
        <div className="glass" style={{ padding: "1.5rem", borderRadius: "16px", textAlign: "center" }}>
          <h3 style={{ color: "var(--text-muted)", fontSize: "1rem", marginBottom: "0.5rem" }}>Productos Activos</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#10b981" }}>{productsCount}</p>
        </div>
        <div className="glass" style={{ padding: "1.5rem", borderRadius: "16px", textAlign: "center" }}>
          <h3 style={{ color: "var(--text-muted)", fontSize: "1rem", marginBottom: "0.5rem" }}>Ganancias Netas</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--primary)" }}>RD$ {totalProfit.toLocaleString('es-DO', { minimumFractionDigits: 0 })}</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
        <div className="glass" style={{ padding: "2rem", borderRadius: "16px" }}>
          <h2 style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}>Órdenes Recientes</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)" }}>
                <th style={{ padding: "1rem 0" }}>ID</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                    No tienes órdenes aún.
                  </td>
                </tr>
              ) : (
                recentOrders.map((ord, idx) => {
                  const s = getStatusColor(ord.status);
                  return (
                    <tr key={ord.id} style={{ borderTop: idx !== 0 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                      <td style={{ padding: "1rem 0", fontWeight: "bold" }}>
                        <Link href={`/vendor/orders`} style={{ color: "var(--text-muted)", textDecoration: "none" }}>#{ord.id}</Link>
                      </td>
                      <td>{ord.buyerName}</td>
                      <td>{new Date(ord.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span style={{ background: s.bg, color: s.color, padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.8rem", fontWeight: "bold" }}>
                          {s.label}
                        </span>
                      </td>
                      <td>RD$ {ord.total.toLocaleString('es-DO', { minimumFractionDigits: 0 })}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="glass" style={{ padding: "2rem", borderRadius: "16px" }}>
          <h2 style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}>Acciones Rápidas</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Link href="/vendor/products" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>+ Agregar Producto</Link>
            <Link href="/vendor/orders" className="btn" style={{ width: "100%", justifyContent: "center", border: "1px solid var(--border)" }}>Ver todas las Órdenes</Link>
            <Link href="/vendor/accounting" className="btn" style={{ width: "100%", justifyContent: "center", background: "transparent", color: "var(--text-muted)" }}>Ir a Contabilidad</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
