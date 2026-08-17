"use client";

import { useState } from "react";
import { createProduct } from "@/actions/product";

export default function AddProductForm({ storeId }: { storeId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados del Formulario
  const [name, setName] = useState("");
  const [netCost, setNetCost] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [applyTax, setApplyTax] = useState(false);
  const [stock, setStock] = useState("");

  // Cálculos Dinámicos
  const costVal = parseFloat(netCost) || 0;
  const baseVal = parseFloat(basePrice) || 0;
  
  const platformFee = baseVal * 0.10;
  const priceAfterFee = baseVal + platformFee;
  const taxAmount = applyTax ? (priceAfterFee * 0.18) : 0;
  const finalPrice = priceAfterFee + taxAmount;

  const profit = baseVal - costVal;
  const roi = costVal > 0 ? ((profit / costVal) * 100).toFixed(1) : "0.0";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    await createProduct(storeId, {
      name,
      netCost,
      basePrice,
      applyTax,
      stock,
      description: "Agregado desde el panel de inventario"
    });

    setLoading(false);
    setIsOpen(false);
    // Reset
    setName(""); setNetCost(""); setBasePrice(""); setApplyTax(false); setStock("");
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="btn btn-primary" style={{ padding: "0.8rem 1.5rem" }}>
        ➕ Añadir Nuevo Producto
      </button>
    );
  }

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="glass animate-fade-in-up" style={{ width: "90%", maxWidth: "600px", padding: "2rem", borderRadius: "16px", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <h2 style={{ margin: 0 }}>📦 Añadir Producto al Inventario</h2>
          <button onClick={() => setIsOpen(false)} style={{ background: "transparent", border: "none", color: "white", fontSize: "1.5rem", cursor: "pointer" }}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            Nombre del Producto
            <input required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ej: iPhone 14 Pro" style={{ padding: "1rem", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", color: "white" }} />
          </label>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              Costo Neto (Lo que te costó)
              <input required type="number" value={netCost} onChange={e => setNetCost(e.target.value)} placeholder="RD$ 0.00" style={{ padding: "1rem", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", color: "white" }} />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              Cantidad en Almacén
              <input required type="number" value={stock} onChange={e => setStock(e.target.value)} placeholder="Ej: 15" style={{ padding: "1rem", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", color: "white" }} />
            </label>
          </div>

          <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            Tu Precio de Venta (Lo que quieres ganar)
            <input required type="number" value={basePrice} onChange={e => setBasePrice(e.target.value)} placeholder="RD$ 0.00" style={{ padding: "1rem", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--primary)", color: "white", fontSize: "1.2rem" }} />
          </label>

          {/* Simulador Financiero Inteligente */}
          {baseVal > 0 && (
            <div style={{ background: "rgba(0,0,0,0.3)", padding: "1.5rem", borderRadius: "12px", border: "1px solid #333" }}>
              <h4 style={{ margin: "0 0 1rem 0", color: "var(--primary)" }}>💡 Resumen Financiero</h4>
              
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.95rem", color: "var(--text-muted)" }}>
                <span>Tu Precio (Base):</span>
                <span>RD$ {baseVal.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", fontSize: "0.95rem", color: "#10b981" }}>
                <span>+ 10% Comisión RDMarket (Cobro automático):</span>
                <span>RD$ {platformFee.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</span>
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "1rem", background: "rgba(255,255,255,0.05)", borderRadius: "8px", cursor: "pointer", marginBottom: "1rem" }}>
                <input type="checkbox" checked={applyTax} onChange={e => setApplyTax(e.target.checked)} style={{ width: "20px", height: "20px" }} />
                <span>Aplicar 18% ITBIS (Añade RD$ {(priceAfterFee * 0.18).toLocaleString('es-DO', { minimumFractionDigits: 2 })})</span>
              </label>

              <div style={{ display: "flex", justifyContent: "space-between", padding: "1rem 0", borderTop: "1px solid #444", borderBottom: "1px solid #444", marginBottom: "1rem" }}>
                <span style={{ fontSize: "1.1rem", fontWeight: "bold" }}>Precio Final Público:</span>
                <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: "white" }}>RD$ {finalPrice.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", color: profit >= 0 ? "#10b981" : "#ef4444" }}>
                <span>Ganancia Neta (Base - Costo): <strong>RD$ {profit.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</strong></span>
                <span>Márgen ROI: <strong>{roi}%</strong></span>
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: "1rem", fontSize: "1.1rem", marginTop: "1rem" }}>
            {loading ? "Guardando Producto..." : "Guardar Producto en Inventario"}
          </button>
        </form>
      </div>
    </div>
  );
}
