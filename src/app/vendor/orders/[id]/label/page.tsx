import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function ShippingLabelPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const order = await prisma.order.findUnique({
    where: { id: resolvedParams.id },
    include: {
      items: { include: { product: true, store: true } },
      buyer: true
    }
  });

  // Mock de orden si no existe en BD (para pruebas)
  const currentOrder = (order as any) || {
    id: resolvedParams.id,
    trackingNumber: "DMX-987654321",
    courier: "Domex",
    shippingAddress: "Av. Winston Churchill #123, Distrito Nacional",
    createdAt: new Date(),
    buyer: { name: "Cliente Ejemplo", email: "cliente@gmail.com" },
    items: [
      { product: { name: "Zapatos Nike Air" }, quantity: 1, store: { name: "Tienda de Zapatos RD", phoneNumber: "809-555-0000" } }
    ]
  };

  const store = currentOrder.items[0]?.store as any;

  return (
    <div style={{ background: "white", color: "black", minHeight: "100vh", padding: "2rem", fontFamily: "monospace" }}>
      {/* Botón de Imprimir (No sale en la impresión por CSS media query, pero lo simulamos aquí ocultándolo al imprimir) */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print { .no-print { display: none !important; } }
      `}} />
      <button className="no-print" onClick={() => window.print()} style={{ marginBottom: "2rem", padding: "1rem 2rem", background: "#000", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "1.1rem" }}>
        🖨️ Imprimir Etiqueta
      </button>

      <div style={{ maxWidth: "600px", margin: "0 auto", border: "2px solid black", padding: "2rem", borderRadius: "8px" }}>
        {/* Header de la Etiqueta */}
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "4px solid black", paddingBottom: "1rem", marginBottom: "1rem" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: "900", letterSpacing: "-1px" }}>RDMarket</h1>
            <p style={{ margin: 0, fontWeight: "bold" }}>Envío Nacional Express</p>
            {currentOrder.requiresTaxReceipt && (
              <div style={{ marginTop: "0.5rem", border: "1px solid black", padding: "0.5rem", display: "inline-block" }}>
                <p style={{ margin: 0, fontWeight: "bold", fontSize: "0.8rem", textTransform: "uppercase" }}>Factura con Valor Fiscal</p>
                <p style={{ margin: 0, fontWeight: "bold", fontSize: "1.1rem" }}>NCF: {currentOrder.ncf || "B0100000001"}</p>
              </div>
            )}
          </div>
          <div style={{ textAlign: "right" }}>
            <h2 style={{ margin: 0, fontSize: "1.5rem" }}>{currentOrder.courier?.toUpperCase() || "STANDARD"}</h2>
            <p style={{ margin: 0, fontSize: "0.9rem" }}>Fecha: {new Date(currentOrder.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Direcciones */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem" }}>
          <div style={{ width: "45%" }}>
            <p style={{ margin: "0 0 0.5rem 0", fontWeight: "bold", fontSize: "0.8rem", color: "#555", textTransform: "uppercase" }}>De (Remitente):</p>
            <p style={{ margin: 0, fontWeight: "bold", fontSize: "1.1rem" }}>{store?.companyLegalName || store?.name || "Tienda Local"}</p>
            {store?.rnc && <p style={{ margin: 0 }}>RNC: {store.rnc}</p>}
            <p style={{ margin: 0 }}>Tel: {store?.phoneNumber || "No registrado"}</p>
          </div>
          
          <div style={{ width: "45%" }}>
            <p style={{ margin: "0 0 0.5rem 0", fontWeight: "bold", fontSize: "0.8rem", color: "#555", textTransform: "uppercase" }}>Para (Destinatario):</p>
            <p style={{ margin: 0, fontWeight: "bold", fontSize: "1.3rem" }}>{currentOrder.requiresTaxReceipt ? currentOrder.buyerCompanyName : (currentOrder.buyer?.name || "Cliente Final")}</p>
            {currentOrder.requiresTaxReceipt && <p style={{ margin: 0, fontWeight: "bold" }}>RNC: {currentOrder.buyerRnc}</p>}
            <p style={{ margin: 0, fontSize: "1.1rem" }}>{currentOrder.shippingAddress || "Dirección pendiente"}</p>
            <p style={{ margin: 0 }}>Tel: {currentOrder.buyer?.email || ""}</p>
          </div>
        </div>

        {/* Tracking Code Grande */}
        <div style={{ textAlign: "center", border: "2px solid black", padding: "1.5rem", marginBottom: "2rem" }}>
          <p style={{ margin: "0 0 0.5rem 0", fontWeight: "bold", fontSize: "0.9rem", textTransform: "uppercase" }}>Tracking ID</p>
          <h2 style={{ margin: 0, fontSize: "2.5rem", letterSpacing: "2px" }}>{currentOrder.trackingNumber || "N/A"}</h2>
          <div style={{ marginTop: "1rem", height: "60px", background: "repeating-linear-gradient(90deg, #000, #000 3px, #fff 3px, #fff 6px, #000 6px, #000 12px, #fff 12px, #fff 15px)", width: "80%", margin: "1rem auto 0 auto" }}>
            {/* Simulación de Código de Barras */}
          </div>
        </div>

        {/* Resumen de Paquete */}
        <div>
          <p style={{ margin: "0 0 0.5rem 0", fontWeight: "bold", fontSize: "0.8rem", color: "#555", textTransform: "uppercase" }}>Contenido del Paquete:</p>
          <ul style={{ margin: 0, paddingLeft: "1.5rem" }}>
            {currentOrder.items.map((item: any, idx: any) => (
              <li key={idx} style={{ marginBottom: "0.5rem", fontSize: "1.1rem" }}>
                <strong>{item.quantity}x</strong> {item.product.name}
              </li>
            ))}
          </ul>
        </div>
        
        <div style={{ borderTop: "2px dashed #999", marginTop: "2rem", paddingTop: "1rem", textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "#666" }}>Por favor pegue esta etiqueta de forma visible en la caja antes de entregar al courier.</p>
        </div>
      </div>
    </div>
  );
}
