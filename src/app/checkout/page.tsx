"use client";

import Link from "next/link";
import { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Mocks para probar la vista
  const cartTotal = 4300;
  const shippingCost = 250; 
  const finalTotal = cartTotal + shippingCost;

  return (
    <PayPalScriptProvider options={{ "clientId": "sb", "currency": "USD", "intent": "capture" }}>
      <main className="container animate-fade-in-up" style={{ padding: "4rem 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2.5rem" }}>Checkout</h1>
          <div style={{ color: "var(--text-muted)" }}>Paso {step} de 2</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "3rem" }}>
          {/* Lado izquierdo - Formularios */}
          <div>
            {step === 1 ? (
              <div className="glass" style={{ padding: "2rem", borderRadius: "16px" }}>
                <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>📍 Dirección de Envío</h2>
                
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <label className="block text-gray-300 text-sm font-medium">
                      Nombre
                      <input required type="text" className="w-full px-4 py-3 mt-1 bg-white/5 border border-white/10 rounded-xl text-white focus:border-primary transition-colors" placeholder="Juan Pérez" />
                    </label>
                    <label className="block text-gray-300 text-sm font-medium">
                      Teléfono
                      <input required type="tel" className="w-full px-4 py-3 mt-1 bg-white/5 border border-white/10 rounded-xl text-white focus:border-primary transition-colors" placeholder="809-555-5555" />
                    </label>
                  </div>

                  <label className="block text-gray-300 text-sm font-medium">
                    Dirección
                    <input required type="text" className="w-full px-4 py-3 mt-1 bg-white/5 border border-white/10 rounded-xl text-white focus:border-primary transition-colors" placeholder="Calle Ejemplo #123" />
                  </label>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <label className="block text-gray-300 text-sm font-medium">
                      Provincia
                      <select required className="w-full px-4 py-3 mt-1 bg-gray-900 border border-white/10 rounded-xl text-white focus:border-primary transition-colors appearance-none">
                        <option value="">Seleccione...</option>
                        <option value="Santo Domingo">Santo Domingo</option>
                        <option value="Distrito Nacional">Distrito Nacional</option>
                        <option value="Santiago">Santiago</option>
                        <option value="Puerto Plata">Puerto Plata</option>
                        <option value="La Romana">La Romana</option>
                      </select>
                    </label>
                    <label className="block text-gray-300 text-sm font-medium">
                      Ciudad / Sector
                      <input required type="text" className="w-full px-4 py-3 mt-1 bg-white/5 border border-white/10 rounded-xl text-white focus:border-primary transition-colors" placeholder="Ensanche Naco" />
                    </label>
                  </div>

                  <div style={{ paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: "1rem" }}>
                    <label className="flex items-center gap-2 text-gray-300 text-sm font-medium cursor-pointer" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                      <input 
                        type="checkbox" 
                        style={{ width: "18px", height: "18px" }}
                        onChange={(e) => {
                          const form = e.target.closest('form');
                          if (e.target.checked) {
                            form?.classList.add('show-rnc');
                          } else {
                            form?.classList.remove('show-rnc');
                          }
                        }}
                      />
                      Solicitar Factura con Valor Fiscal (B01)
                    </label>
                    
                    <div className="rnc-fields" style={{ display: "none", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                      <label className="block text-gray-300 text-sm font-medium">
                        Razón Social de la Empresa
                        <input type="text" className="w-full px-4 py-3 mt-1 bg-white/5 border border-white/10 rounded-xl text-white focus:border-primary transition-colors" placeholder="Ej. Mi Empresa SRL" />
                      </label>
                      <label className="block text-gray-300 text-sm font-medium">
                        RNC
                        <input type="text" className="w-full px-4 py-3 mt-1 bg-white/5 border border-white/10 rounded-xl text-white focus:border-primary transition-colors" placeholder="Ej. 130000000" />
                      </label>
                    </div>
                    <style dangerouslySetInnerHTML={{__html: `
                      form.show-rnc .rnc-fields { display: grid !important; }
                    `}} />
                  </div>

                  <div style={{ paddingTop: "1rem" }}>
                    <button type="submit" className="btn btn-primary w-full" style={{ padding: "1rem", fontSize: "1.1rem" }}>Continuar al Pago</button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="glass animate-fade-in-up" style={{ padding: "2rem", borderRadius: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                  <h2 style={{ fontSize: "1.5rem" }}>💳 Método de Pago</h2>
                  <button onClick={() => setStep(1)} style={{ background: "transparent", border: "none", color: "var(--primary)", cursor: "pointer", fontWeight: "bold" }}>← Volver</button>
                </div>

                <div style={{ border: "1px solid var(--primary)", borderRadius: "12px", padding: "1.5rem", background: "rgba(37, 99, 235, 0.05)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "var(--primary)", border: "4px solid #fff", boxShadow: "0 0 0 1px var(--primary)" }}></div>
                      <span style={{ fontSize: "1.1rem", fontWeight: "bold" }}>PayPal Commerce Platform</span>
                    </div>
                    <span style={{ fontSize: "1.5rem" }}>💳</span>
                  </div>
                  <p style={{ marginBottom: "2rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                    Paga de forma segura. El dinero será distribuido automáticamente a RDMarket y a la Tienda de forma transparente.
                  </p>

                  <PayPalButtons 
                    style={{ layout: "vertical", shape: "rect" }}
                    createOrder={async (data, actions) => {
                      const res = await fetch("/api/paypal/create-order", { method: "POST" });
                      const order = await res.json();
                      if (order.id) return order.id;
                      throw new Error(order.error || "Error creando orden");
                    }}
                    onApprove={async (data, actions) => {
                      const res = await fetch("/api/paypal/capture-order", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ orderID: data.orderID })
                      });
                      const captureData = await res.json();
                      if (captureData.success) {
                        alert("¡Pago exitoso! La orden ha sido registrada.");
                        router.push("/");
                      } else {
                        alert("Error confirmando el pago: " + captureData.error);
                      }
                    }}
                  />

                </div>
              </div>
            )}
          </div>

          {/* Lado derecho - Resumen de Orden */}
          <div className="glass" style={{ padding: "2rem", borderRadius: "16px", height: "fit-content", position: "sticky", top: "100px" }}>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>Resumen del Pedido</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Subtotal (2 artículos)</span>
                <span>RD$ {cartTotal.toLocaleString('es-DO')}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Envío Nacional (Domex)</span>
                <span>RD$ {shippingCost.toLocaleString('es-DO')}</span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "1.5rem", marginBottom: "2rem" }}>
              <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>Total a Pagar</span>
              <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--primary)" }}>RD$ {finalTotal.toLocaleString('es-DO')}</span>
            </div>
            
            <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "1rem" }}>
              🔒 Tus datos están protegidos y encriptados. Pagos procesados por PayPal.
            </p>
          </div>
        </div>
      </main>
    </PayPalScriptProvider>
  );
}
