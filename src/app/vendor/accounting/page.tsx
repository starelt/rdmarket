import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function VendorAccountingPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const store = await prisma.store.findFirst({
    where: { ownerId: session.user.id }
  });

  if (!store) {
    return (
      <div className="container" style={{ padding: "4rem 20px", textAlign: "center" }}>
        <h2>Debes configurar tu tienda primero.</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>Antes de llevar tu contabilidad, debes registrar legalmente tu tienda.</p>
        <a href="/vendor/onboarding" className="btn btn-primary" style={{ padding: "1rem 2rem", textDecoration: "none" }}>
          Ir a Configurar Mi Tienda
        </a>
      </div>
    );
  }

  // Obtener ventas (ordenes pagadas/completadas)
  const orderItems = await prisma.orderItem.findMany({
    where: { 
      storeId: store.id,
      order: { status: { not: "CANCELLED" } }
    },
    include: { product: true }
  });

  // Variables contables
  let totalSales = 0;
  let totalNetCost = 0;
  let totalPlatformFees = 0;
  let totalTaxesCollected = 0;

  orderItems.forEach(item => {
    // Re-calculamos lo que representó esta venta
    // En una DB real esto se debería guardar en el OrderItem en el momento de la compra
    const p = item.product;
    if (p) {
      const netCost = (p.netCost || 0) * item.quantity;
      const basePriceTotal = p.basePrice * item.quantity;
      const platformFee = basePriceTotal * 0.10;
      const taxAmount = (basePriceTotal + platformFee) * p.taxRate;
      const finalSalePrice = basePriceTotal + platformFee + taxAmount;

      totalSales += finalSalePrice;
      totalNetCost += netCost;
      totalPlatformFees += platformFee;
      totalTaxesCollected += taxAmount;
    }
  });

  const netProfit = totalSales - totalNetCost - totalPlatformFees - totalTaxesCollected;

  return (
    <div className="animate-fade-in-up">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", margin: 0 }}>💼 Contabilidad de la Tienda</h1>
          <p style={{ color: "var(--text-muted)", margin: "0.5rem 0 0 0" }}>Control financiero y ganancias netas reales de tu negocio.</p>
        </div>
        <div style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981", padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #10b981" }}>
          <span>PayPal Automático <strong>Activado</strong> ✅</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem", marginBottom: "3rem" }}>
        <div style={{ background: "var(--card-bg)", padding: "2rem", borderRadius: "16px", border: "1px solid var(--border)" }}>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem", marginBottom: "0.5rem" }}>Ingresos Brutos (Ventas Totales)</p>
          <h2 style={{ fontSize: "2.5rem", color: "white", margin: 0 }}>RD$ {totalSales.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</h2>
        </div>

        <div style={{ background: "rgba(239, 68, 68, 0.05)", padding: "2rem", borderRadius: "16px", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
          <p style={{ color: "#ef4444", fontSize: "1rem", marginBottom: "0.5rem" }}>Costo de Mercancía Vendida</p>
          <h2 style={{ fontSize: "2.5rem", color: "#ef4444", margin: 0 }}>-RD$ {totalNetCost.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "1rem" }}>Lo que te costó comprar los productos que ya vendiste.</p>
        </div>

        <div style={{ background: "rgba(59, 130, 246, 0.05)", padding: "2rem", borderRadius: "16px", border: "1px solid rgba(59, 130, 246, 0.3)" }}>
          <p style={{ color: "#3b82f6", fontSize: "1rem", marginBottom: "0.5rem" }}>Retenciones (Comisiones e ITBIS)</p>
          <h2 style={{ fontSize: "2.5rem", color: "#3b82f6", margin: 0 }}>-RD$ {(totalPlatformFees + totalTaxesCollected).toLocaleString('es-DO', { minimumFractionDigits: 2 })}</h2>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
            <span>10% RDMarket: RD$ {totalPlatformFees.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</span>
            <span>ITBIS (18%): RD$ {totalTaxesCollected.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      <div style={{ background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05))", padding: "3rem", borderRadius: "16px", border: "1px solid #10b981", textAlign: "center" }}>
        <p style={{ color: "#10b981", fontSize: "1.2rem", marginBottom: "0.5rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>Tu Ganancia Neta Real</p>
        <h1 style={{ fontSize: "4.5rem", color: "#10b981", margin: 0 }}>RD$ {netProfit.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1rem", marginTop: "1rem" }}>Dinero limpio que ha entrado a tu bolsillo (Ventas - Costos - Retenciones).</p>
      </div>

    </div>
  );
}
