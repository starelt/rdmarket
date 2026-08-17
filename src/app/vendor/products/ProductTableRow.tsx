"use client";

import { useState } from "react";
import { deleteProduct, toggleProductStatus } from "@/actions/product";

export default function ProductTableRow({ product }: { product: any }) {
  const [loading, setLoading] = useState(false);

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  const handleToggle = async () => {
    setLoading(true);
    await toggleProductStatus(product.id, product.isActive);
    setLoading(false);
  };

  const handleDelete = async () => {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      setLoading(true);
      await deleteProduct(product.id);
      setLoading(false);
    }
  };

  return (
    <tr style={{ borderTop: "1px solid rgba(255,255,255,0.05)", opacity: product.isActive ? 1 : 0.5 }}>
      <td style={{ padding: "1rem 0" }}>
        <img src={product.image || ""} alt={product.name} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }} />
      </td>
      <td style={{ fontWeight: "500" }}>
        {product.name}
        {isLowStock && <span style={{ display: "inline-block", marginLeft: "0.5rem", background: "rgba(239, 68, 68, 0.2)", color: "#ef4444", padding: "0.1rem 0.4rem", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "bold" }}>¡Casi Agotado!</span>}
      </td>
      <td style={{ color: "white" }}>RD$ {(product.basePrice || 0).toLocaleString('es-DO')}</td>
      <td style={{ color: "var(--primary)", fontWeight: "bold" }}>
        RD$ {(product.price || 0).toLocaleString('es-DO')}
        {product.taxRate > 0 && <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginLeft: "4px" }}>+ ITBIS</span>}
      </td>
      <td>
        <span style={{ 
          color: isOutOfStock ? "#ef4444" : isLowStock ? "#f59e0b" : "#10b981", 
          fontWeight: "bold" 
        }}>
          {product.stock} en almacén
        </span>
      </td>
      <td>
        <span style={{ color: product.isActive ? "#10b981" : "var(--text-muted)", fontSize: "0.9rem" }}>
          {product.isActive ? "Público" : "Pausado"}
        </span>
      </td>
      <td>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button 
            onClick={handleToggle}
            disabled={loading}
            style={{ background: "transparent", border: "1px solid var(--border)", color: "white", padding: "0.4rem 0.6rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem" }}>
            {product.isActive ? "⏸️ Pausar" : "▶️ Activar"}
          </button>
          <button 
            onClick={handleDelete}
            disabled={loading}
            style={{ background: "transparent", border: "1px solid #ef4444", color: "#ef4444", padding: "0.4rem 0.6rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem" }}>
            🗑️
          </button>
        </div>
      </td>
    </tr>
  );
}
