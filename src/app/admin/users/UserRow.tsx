"use client";

import { useState } from "react";
import { updateUserCredentials } from "@/actions/user";

export default function UserRow({ user, store }: { user: any, store: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await updateUserCredentials(user.id, email, password);
    setLoading(false);
    if (result.success) {
      alert("✅ Usuario actualizado correctamente.");
      setIsEditing(false);
    } else {
      alert("❌ Error: " + result.message);
    }
  };

  return (
    <>
      <tr style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <td style={{ padding: "1rem 0", fontWeight: "500" }}>
          <div>{user.name}</div>
          <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: "normal" }}>{user.email}</div>
        </td>
        <td>
          <span style={{ 
            background: user.role === "ADMIN" ? "rgba(16, 185, 129, 0.2)" : user.role === "VENDOR" ? "rgba(59, 130, 246, 0.2)" : "rgba(255, 255, 255, 0.1)", 
            color: user.role === "ADMIN" ? "#10b981" : user.role === "VENDOR" ? "#3b82f6" : "white", 
            padding: "0.2rem 0.6rem", borderRadius: "12px", fontSize: "0.8rem", fontWeight: "bold"
          }}>
            {user.role}
          </span>
        </td>
        <td>{store ? store.name : <span style={{ color: "var(--text-muted)" }}>-</span>}</td>
        <td>
          {store ? (
            <span style={{ 
              color: store.status === "APPROVED" ? "#10b981" : store.status === "REJECTED" ? "#ef4444" : "var(--accent)", 
              fontWeight: "bold", fontSize: "0.9rem" 
            }}>
              {store.status}
            </span>
          ) : "-"}
        </td>
        <td>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              style={{ background: "transparent", border: "1px solid var(--primary)", color: "var(--primary)", padding: "0.4rem 0.8rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "bold" }}>
              {isEditing ? "Cancelar" : "✏️ Editar"}
            </button>
            <button style={{ background: "transparent", border: "1px solid #ef4444", color: "#ef4444", padding: "0.4rem 0.8rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "bold" }}>
              🗑️ Eliminar
            </button>
          </div>
        </td>
      </tr>

      {isEditing && (
        <tr>
          <td colSpan={5} style={{ padding: "0" }}>
            <div style={{ background: "rgba(0,0,0,0.3)", padding: "1.5rem", borderRadius: "8px", margin: "0.5rem 0 1.5rem 0", borderLeft: "4px solid var(--primary)" }}>
              <h4 style={{ marginBottom: "1rem", color: "white" }}>Soporte Técnico: Modificar Credenciales</h4>
              <form onSubmit={handleUpdate} style={{ display: "flex", gap: "1rem", alignItems: "flex-end" }}>
                <label style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.9rem" }}>
                  Nuevo Correo Electrónico
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: "0.8rem", borderRadius: "6px", background: "#222", border: "1px solid #444", color: "white" }} />
                </label>
                <label style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.9rem" }}>
                  Nueva Contraseña <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>(Dejar en blanco para no cambiar)</span>
                  <input type="text" value={password} onChange={e => setPassword(e.target.value)} placeholder="Ej: NuevaClave123" style={{ padding: "0.8rem", borderRadius: "6px", background: "#222", border: "1px solid #444", color: "white" }} />
                </label>
                <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: "0.8rem 1.5rem", height: "45px" }}>
                  {loading ? "Guardando..." : "Guardar Cambios"}
                </button>
              </form>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
