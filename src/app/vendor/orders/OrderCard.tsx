"use client";

import { useState } from "react";
// Aquí importaríamos un server action, por ejemplo: import { dispatchOrder } from "@/actions/order"

export default function OrderCard({ order }: { order: any }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(order.status);
  const [courier, setCourier] = useState(order.courier || "");
  const [tracking, setTracking] = useState(order.trackingNumber || "");
  const [ncf, setNcf] = useState(order.ncf || "");

  const handleDispatch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    // Aquí llamaríamos a la base de datos real:
    // await dispatchOrder(order.id, { courier, tracking, ncf, packingVideoProof: ... })
    
    // Simulación
    setTimeout(() => {
      setStatus("SHIPPED");
      setLoading(false);
      alert(`Orden despachada exitosamente con Tracking: ${tracking}`);
    }, 1000);
  };

  return (
    <div className="glass" style={{ padding: "1.5rem", borderRadius: "12px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "2rem", marginBottom: "1rem" }}>
      <div>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{new Date(order.createdAt).toLocaleDateString()}</p>
        <h3 style={{ fontSize: "1.2rem", margin: "0.2rem 0" }}>#{order.id.slice(0,8).toUpperCase()}</h3>
        <p>Cliente: {order.buyer?.name || "Usuario"}</p>
        <h4 style={{ color: "var(--primary)", marginTop: "0.5rem" }}>RD$ {order.totalAmount.toLocaleString('es-DO')}</h4>

        {order.requiresTaxReceipt && (
          <div style={{ marginTop: "1rem", background: "rgba(234, 179, 8, 0.1)", border: "1px solid #eab308", padding: "0.8rem", borderRadius: "8px" }}>
            <p style={{ color: "#eab308", fontWeight: "bold", margin: "0 0 0.25rem 0", fontSize: "0.9rem" }}>⚠️ Requiere Comprobante Fiscal</p>
            <p style={{ margin: 0, fontSize: "0.85rem" }}><strong>Razón Social:</strong> {order.buyerCompanyName}</p>
            <p style={{ margin: 0, fontSize: "0.85rem" }}><strong>RNC:</strong> {order.buyerRnc}</p>
          </div>
        )}
      </div>

      <div style={{ flex: "1", minWidth: "300px", background: "rgba(0,0,0,0.2)", padding: "1rem", borderRadius: "8px" }}>
        <h4 style={{ marginBottom: "0.5rem" }}>✈️ Logística de Envío</h4>
        
        {status === "PENDING" || status === "PROCESSING" ? (
          <form onSubmit={handleDispatch} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            
            {order.requiresTaxReceipt && (
               <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem", fontSize: "0.9rem" }}>
                 <strong style={{ color: "#eab308" }}>Asignar NCF (B01)</strong>
                 <input type="text" value={ncf} onChange={e => setNcf(e.target.value)} required placeholder="Ej. B0100000001" style={{ padding: "0.5rem", borderRadius: "6px", background: "#222", color: "white", border: "1px solid #eab308" }} />
               </label>
            )}

            <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem", fontSize: "0.9rem" }}>
              <strong>1. Prueba de Empaque (Video/Foto)</strong>
              <input type="file" required accept="video/*,image/*" style={{ padding: "0.5rem", borderRadius: "6px", background: "rgba(255,255,255,0.05)", color: "white", border: "1px dashed var(--accent)" }} />
            </label>
            
            <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem", fontSize: "0.9rem", marginTop: "0.5rem" }}>
              <strong>2. Detalles del Courier</strong>
              <select value={courier} onChange={e => setCourier(e.target.value)} required style={{ padding: "0.5rem", borderRadius: "6px", background: "#222", color: "white", border: "1px solid #444" }}>
                <option value="">Selecciona el Courier...</option>
                <option value="Domex">Domex (Nacional)</option>
                <option value="BMCargo">BM Cargo (Nacional)</option>
                <option value="PedidosYa">PedidosYa (Local Express)</option>
                <option value="Propio">Mensajero Propio</option>
              </select>
            </label>

            <input type="text" value={tracking} onChange={e => setTracking(e.target.value)} required placeholder="Número de Guía (Tracking)" style={{ padding: "0.5rem", borderRadius: "6px", background: "#222", color: "white", border: "1px solid #444" }} />
            
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: "0.75rem", marginTop: "0.5rem", fontWeight: "bold" }}>
              {loading ? "Procesando..." : "Subir Pruebas y Despachar"}
            </button>
          </form>
        ) : (
          <div>
            <div style={{ display: "inline-block", background: "var(--primary)", color: "white", padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.8rem", marginBottom: "0.5rem", fontWeight: "bold" }}>DESPACHADO</div>
            <p style={{ margin: "0.25rem 0" }}><strong>Compañía:</strong> {courier}</p>
            <p style={{ margin: "0.25rem 0" }}><strong>Tracking:</strong> {tracking}</p>
            {order.requiresTaxReceipt && ncf && (
              <p style={{ margin: "0.25rem 0", color: "#eab308" }}><strong>NCF Asignado:</strong> {ncf}</p>
            )}
            
            <a 
              href={`/vendor/orders/${order.id}/label`} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ display: "inline-block", marginTop: "1rem", padding: "0.75rem 1rem", background: "white", color: "black", textDecoration: "none", borderRadius: "6px", fontWeight: "bold", fontSize: "0.9rem", textAlign: "center", width: "100%" }}>
              🖨️ Imprimir Etiqueta {order.requiresTaxReceipt && "/ Factura"}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
