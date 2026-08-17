import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const order = await prisma.order.findUnique({
    where: { id: resolvedParams.id },
    include: {
      items: {
        include: { product: true, store: true }
      }
    }
  });

  // For testing UI without a real order, we'll mock an order if not found
  const mockOrder = {
    id: resolvedParams.id,
    totalAmount: 3750,
    status: "PAID",
    shippingStatus: "IN_TRANSIT",
    courier: "Domex",
    trackingNumber: "DMX-987654321",
    shippingAddress: "Av. Winston Churchill #123, Distrito Nacional",
    packingVideoProof: null,
    items: [
      { product: { name: "Zapatos Nike Air", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200" }, store: { name: "Tienda Ejemplo" }, price: 3500, quantity: 1 }
    ]
  };

  const currentOrder = order || mockOrder;

  // AliExpress style progress bar logic
  const stages = ["PENDING", "DISPATCHED", "IN_TRANSIT", "DELIVERED"];
  const currentStageIndex = stages.indexOf(currentOrder.shippingStatus);

  return (
    <div className="container" style={{ padding: "4rem 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem" }}>📦 Rastreo de Paquete</h1>
        <Link href="/" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: "bold" }}>Volver al inicio</Link>
      </div>

      <div className="glass" style={{ padding: "3rem", borderRadius: "16px", marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3rem" }}>
          <div>
            <p style={{ color: "var(--text-muted)", margin: "0 0 0.5rem 0" }}>Número de Orden</p>
            <h3 style={{ fontSize: "1.2rem", margin: 0 }}>#{currentOrder.id.split('-')[0].toUpperCase()}</h3>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: "var(--text-muted)", margin: "0 0 0.5rem 0" }}>Courier Asignado</p>
            <h3 style={{ fontSize: "1.2rem", margin: 0, color: "var(--primary)" }}>{currentOrder.courier || "Pendiente"}</h3>
            <p style={{ color: "white", fontWeight: "bold", margin: "0.5rem 0 0 0" }}>Tracking: {currentOrder.trackingNumber || "N/A"}</p>
          </div>
        </div>

        {/* Barra de progreso estilo AliExpress */}
        <div style={{ position: "relative", display: "flex", justifyContent: "space-between", marginBottom: "2rem" }}>
          <div style={{ position: "absolute", top: "20px", left: "0", right: "0", height: "4px", background: "var(--border)", zIndex: 0 }}></div>
          
          <div style={{ position: "absolute", top: "20px", left: "0", width: `${(currentStageIndex / (stages.length - 1)) * 100}%`, height: "4px", background: "#10b981", zIndex: 1, transition: "width 0.5s ease" }}></div>

          {[
            { id: "PENDING", label: "Procesando", icon: "📋" },
            { id: "DISPATCHED", label: "Despachado", icon: "📦" },
            { id: "IN_TRANSIT", label: "En Tránsito", icon: "🚚" },
            { id: "DELIVERED", label: "Entregado", icon: "✅" }
          ].map((stage, index) => {
            const isCompleted = index <= currentStageIndex;
            const isCurrent = index === currentStageIndex;
            return (
              <div key={stage.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2, width: "80px" }}>
                <div style={{ 
                  width: "44px", height: "44px", borderRadius: "50%", 
                  background: isCompleted ? "#10b981" : "var(--card-bg)", 
                  border: `4px solid ${isCompleted ? "#10b981" : "var(--border)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.2rem", marginBottom: "0.5rem",
                  boxShadow: isCurrent ? "0 0 15px rgba(16, 185, 129, 0.5)" : "none"
                }}>
                  {stage.icon}
                </div>
                <span style={{ fontSize: "0.85rem", fontWeight: isCurrent ? "bold" : "normal", color: isCompleted ? "white" : "var(--text-muted)", textAlign: "center" }}>
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>

        {currentStageIndex === 3 && (
          <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid #10b981", padding: "1.5rem", borderRadius: "12px", textAlign: "center", marginTop: "2rem" }}>
            <h3 style={{ color: "#10b981", marginBottom: "0.5rem" }}>¡Paquete Entregado!</h3>
            <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>¿Cómo fue tu experiencia con el envío de {currentOrder.courier}?</p>
            <div style={{ fontSize: "2rem", display: "flex", justifyContent: "center", gap: "0.5rem", cursor: "pointer" }}>
              ⭐ ⭐ ⭐ ⭐ ⭐
            </div>
            <textarea placeholder="Deja tu reseña sobre el paquete (opcional)" style={{ width: "100%", marginTop: "1rem", padding: "1rem", borderRadius: "8px", border: "1px solid var(--border)", background: "transparent", color: "white" }}></textarea>
            <button className="btn btn-primary" style={{ marginTop: "1rem" }}>Enviar Reseña</button>
          </div>
        )}
      </div>

      {currentOrder.packingVideoProof && (
        <div className="glass" style={{ padding: "2rem", borderRadius: "16px", marginBottom: "2rem", border: "1px solid var(--primary)" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.5rem" }}>🎥</span> Prueba de Empaque (Anti-Fraude)
          </h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>El vendedor grabó este video demostrando el funcionamiento y correcto empaque de tu producto antes de entregarlo al courier.</p>
          <div style={{ width: "100%", height: "250px", background: "black", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
            {/* Simulación del reproductor de video */}
            <span>▶️ Reproducir Video ({currentOrder.packingVideoProof})</span>
          </div>
        </div>
      )}

      <div className="glass" style={{ padding: "2rem", borderRadius: "16px" }}>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>Detalles de los Artículos</h2>
        {currentOrder.items.map((item, idx) => (
          <div key={idx} style={{ display: "flex", gap: "1rem", marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <img src={item.product.image || ""} alt={item.product.name} style={{ width: "80px", height: "80px", borderRadius: "8px", objectFit: "cover" }} />
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: "1.1rem", margin: "0 0 0.25rem 0" }}>{item.product.name}</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: "0 0 0.5rem 0" }}>🏪 {item.store.name}</p>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Cant: {item.quantity}</span>
                <span style={{ fontWeight: "bold", color: "var(--primary)" }}>RD$ {item.price.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
