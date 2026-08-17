"use client";

import { useState } from "react";
import { deleteProductAdmin } from "@/actions/admin";

export default function ProductAdminActions({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);

  return (
    <button
      onClick={async () => {
        if(confirm("¿Seguro que deseas eliminar este producto (sanción)?")) {
          setLoading(true);
          try {
            await deleteProductAdmin(productId);
          } catch(e: any) {
            alert(e.message);
          } finally {
            setLoading(false);
          }
        }
      }}
      disabled={loading}
      style={{
        background: "transparent",
        border: "1px solid #ef4444",
        color: "#ef4444",
        padding: "0.4rem 0.8rem",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "0.85rem",
        opacity: loading ? 0.5 : 1
      }}
    >
      {loading ? "..." : "🗑️ Eliminar Producto"}
    </button>
  );
}
