"use client";

import { useState } from "react";
import { activateStore, rejectStore } from "@/actions/admin";

export default function VerificationActions({ storeId }: { storeId: string }) {
  const [loading, setLoading] = useState(false);

  return (
    <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
      <button 
        onClick={async () => {
          if (confirm("¿Aprobar esta tienda para vender?")) {
            setLoading(true);
            await activateStore(storeId);
            setLoading(false);
          }
        }}
        disabled={loading}
        className="btn btn-primary" 
        style={{ flex: 1, padding: "1rem", background: "#10b981", border: "none", opacity: loading ? 0.5 : 1 }}>
        ✅ APROBAR TIENDA
      </button>

      <button 
        onClick={async () => {
          if (confirm("¿Rechazar esta solicitud de tienda?")) {
            setLoading(true);
            await rejectStore(storeId);
            setLoading(false);
          }
        }}
        disabled={loading}
        className="btn" 
        style={{ flex: 1, padding: "1rem", background: "transparent", border: "1px solid #ef4444", color: "#ef4444", opacity: loading ? 0.5 : 1 }}>
        ❌ RECHAZAR SOLICITUD
      </button>
    </div>
  );
}
