import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import OrderCard from "./OrderCard";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const store = await prisma.store.findFirst({
    where: { ownerId: session.user.id }
  });

  if (!store) {
    return (
      <div className="container" style={{ padding: "4rem 20px", textAlign: "center" }}>
        <h2>Debes configurar tu tienda primero.</h2>
        <a href="/vendor/onboarding" className="btn btn-primary" style={{ padding: "1rem 2rem", textDecoration: "none" }}>
          Ir a Configurar Mi Tienda
        </a>
      </div>
    );
  }

  // Obtener órdenes de esta tienda
  const orderItems = await prisma.orderItem.findMany({
    where: { storeId: store.id },
    include: { order: { include: { buyer: true } } },
    orderBy: { order: { createdAt: "desc" } }
  });

  const ordersMap = new Map();

  orderItems.forEach(item => {
    const order = item.order;
    if (!ordersMap.has(order.id)) {
      ordersMap.set(order.id, {
        id: order.id,
        createdAt: order.createdAt,
        totalAmount: order.totalAmount, // Para el mock de prueba, en la vida real es la suma de los items de esta tienda.
        status: order.status,
        buyer: order.buyer,
        courier: order.courier,
        trackingNumber: order.trackingNumber,
        requiresTaxReceipt: order.requiresTaxReceipt,
        buyerCompanyName: order.buyerCompanyName,
        buyerRnc: order.buyerRnc,
        ncf: order.ncf
      });
    }
  });

  const orders = Array.from(ordersMap.values());

  return (
    <div className="animate-fade-in-up">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1>📝 Gestión de Órdenes y Envíos</h1>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {orders.length === 0 ? (
           <div className="glass" style={{ padding: "3rem", textAlign: "center", borderRadius: "12px", color: "var(--text-muted)" }}>
             No tienes órdenes pendientes.
           </div>
        ) : (
          orders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))
        )}
      </div>
    </div>
  );
}
