"use client";

import { useState } from "react";
import { updateStoreSettings } from "@/actions/vendor";

export default function SettingsForm({ store }: { store: any }) {
  const [loading, setLoading] = useState(false);
  const [rnc, setRnc] = useState(store.rnc || "");
  const [companyLegalName, setCompanyLegalName] = useState(store.companyLegalName || "");
  const [paypalEmail, setPaypalEmail] = useState(store.paypalEmail || "");

  const handleSaveDGII = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await updateStoreSettings(store.id, { rnc, companyLegalName, paypalEmail });
    alert("Datos Guardados exitosamente.");
    setLoading(false);
  };

  return (
    <div className="animate-fade-in-up max-w-4xl mx-auto">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1>⚙️ Configuración de la Tienda</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
        {/* Confianza y Personal (Simulado) */}
        <div className="glass" style={{ padding: "2rem", borderRadius: "16px" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>Identidad de la Marca</h2>
          <p style={{ color: "var(--text-muted)" }}>Las opciones de logo y banner se gestionan en otro panel por ahora.</p>
        </div>

        {/* Facturación Electrónica DGII y PayPal */}
        <div className="glass" style={{ padding: "2rem", borderRadius: "16px", border: "1px solid var(--primary)" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem", color: "var(--primary)" }}>🏦 Facturación y Cobros</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
            Configura tus datos fiscales para emitir comprobantes (DGII) y tu cuenta de PayPal para recibir tus pagos (90% de la venta automáticamente).
          </p>
          
          <form onSubmit={handleSaveDGII} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            <div style={{ borderLeft: "4px solid #0070ba", paddingLeft: "1rem" }}>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Cobros de Ventas</h3>
              <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                Correo Electrónico de tu cuenta PayPal
                <input 
                  type="email" 
                  value={paypalEmail} 
                  onChange={e => setPaypalEmail(e.target.value)} 
                  placeholder="ejemplo@empresa.com" 
                  style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--secondary)", color: "var(--text-color)" }} 
                />
              </label>
            </div>

            <div style={{ borderLeft: "4px solid #eab308", paddingLeft: "1rem" }}>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Comprobantes Fiscales (Opcional)</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  Razón Social (Nombre legal)
                  <input 
                    type="text" 
                    value={companyLegalName} 
                    onChange={e => setCompanyLegalName(e.target.value)} 
                    placeholder="Ej. ElectroMundo SRL" 
                    style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--secondary)", color: "var(--text-color)" }} 
                  />
                </label>
                
                <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  RNC
                  <input 
                    type="text" 
                    value={rnc} 
                    onChange={e => setRnc(e.target.value)} 
                    placeholder="Ej. 132456789" 
                    style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--secondary)", color: "var(--text-color)" }} 
                  />
                </label>
              </div>
            </div>
            
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: "1rem", alignSelf: "flex-start", padding: "1rem 2rem", fontWeight: "bold" }}>
              {loading ? "Guardando..." : "Guardar Datos Fiscales"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
