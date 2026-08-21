"use client";

import { useState } from "react";
import { updateUserCredentials } from "@/actions/user";

import { suspendStore, activateStore, addPenalty, deleteUser } from "@/actions/admin";

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
      <tr style={{ borderTop: "1px solid #f3f4f6" }}>
        <td style={{ padding: "1rem 0", fontWeight: "500", color: "#111" }}>
          <div>{user.name}</div>
          <div style={{ color: "#666", fontSize: "0.85rem", fontWeight: "normal" }}>{user.email}</div>
        </td>
        <td>
          <span style={{ 
            background: user.role === "ADMIN" ? "#ecfdf5" : user.role === "VENDOR" ? "#eff6ff" : "#f3f4f6", 
            color: user.role === "ADMIN" ? "#10b981" : user.role === "VENDOR" ? "#3b82f6" : "#4b5563", 
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
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              style={{ background: "transparent", border: "1px solid var(--primary)", color: "var(--primary)", padding: "0.4rem 0.8rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "bold" }}>
              {isEditing ? "Cancelar" : "✏️ Editar"}
            </button>
            <button 
              onClick={async () => {
                if (confirm("¿Estás seguro de que quieres eliminar a este usuario permanentemente?")) {
                  const res = await deleteUser(user.id);
                  if (res?.error) alert(res.error);
                }
              }}
              style={{ background: "transparent", border: "1px solid #ef4444", color: "#ef4444", padding: "0.4rem 0.8rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "bold" }}>
              🗑️ Eliminar
            </button>
            {store && (
              <>
                <button 
                  onClick={async () => {
                    if (store.status === "SUSPENDED") {
                      await activateStore(store.id);
                    } else {
                      if(confirm("¿Seguro que quieres suspender esta tienda?")) {
                        await suspendStore(store.id);
                      }
                    }
                  }}
                  style={{ background: store.status === "SUSPENDED" ? "#10b981" : "#ef4444", color: "white", padding: "0.4rem 0.8rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "bold", border: "none" }}>
                  {store.status === "SUSPENDED" ? "✅ Reactivar" : "🚫 Suspender"}
                </button>
                
                <button 
                  onClick={async () => {
                    const amount = prompt("Monto de la multa a cobrar en DOP:");
                    if(amount && !isNaN(Number(amount))) {
                      await addPenalty(store.id, Number(amount));
                    }
                  }}
                  style={{ background: "#f59e0b", color: "white", padding: "0.4rem 0.8rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "bold", border: "none" }}>
                  💰 Multar
                </button>

                <a href={`/admin/store/${store.id}/products`}
                  style={{ background: "var(--primary)", color: "white", padding: "0.4rem 0.8rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "bold", border: "none", textDecoration: "none" }}>
                  📦 Ver Productos
                </a>
              </>
            )}
          </div>
        </td>
      </tr>

      {isEditing && (
        <tr>
          <td colSpan={5} style={{ padding: "0" }}>
            <div style={{ background: "#f8fafc", padding: "1.5rem", borderRadius: "8px", margin: "0.5rem 0 1.5rem 0", borderLeft: "4px solid #ff4747", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)" }}>
              <h4 style={{ marginBottom: "1rem", color: "#111" }}>Soporte Técnico: Modificar Credenciales</h4>
              <form onSubmit={handleUpdate} style={{ display: "flex", gap: "1rem", alignItems: "flex-end" }}>
                <label style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.9rem", color: "#333", fontWeight: "bold" }}>
                  Nuevo Correo Electrónico
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: "0.8rem", borderRadius: "6px", background: "white", border: "1px solid #ccc", color: "#111" }} />
                </label>
                <label style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.9rem", color: "#333", fontWeight: "bold" }}>
                  Nueva Contraseña <span style={{ fontSize: "0.8rem", color: "#666", fontWeight: "normal" }}>(Dejar en blanco para no cambiar)</span>
                  <input type="text" value={password} onChange={e => setPassword(e.target.value)} placeholder="Ej: NuevaClave123" style={{ padding: "0.8rem", borderRadius: "6px", background: "white", border: "1px solid #ccc", color: "#111" }} />
                </label>
                <button type="submit" disabled={loading} style={{ padding: "0.8rem 1.5rem", height: "45px", background: "#ff4747", color: "white", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
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
