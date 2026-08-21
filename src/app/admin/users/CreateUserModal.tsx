"use client";

import { useState } from "react";
import { createAdminUser } from "@/actions/admin";

export default function CreateUserModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const res = await createAdminUser(formData);
    setLoading(false);

    if (res?.error) {
      setError(res.error);
    } else {
      setOpen(false);
    }
  };

  if (!open) {
    return (
      <button 
        onClick={() => setOpen(true)}
        style={{
          background: "#ff4747",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "8px",
          fontWeight: "bold",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}
      >
        <span>+</span> Crear Usuario
      </button>
    );
  }

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: "white", padding: "2rem", borderRadius: "16px", width: "100%", maxWidth: "400px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)", color: "#111" }}>
        <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.5rem" }}>Crear Nuevo Usuario</h2>
        
        {error && <div style={{ background: "#fee2e2", color: "#dc2626", padding: "10px", borderRadius: "8px", marginBottom: "1rem", fontSize: "0.9rem" }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "0.9rem" }}>Nombre</label>
            <input type="text" name="name" required style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }} placeholder="Nombre completo" />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "0.9rem" }}>Correo Electrónico</label>
            <input type="email" name="email" required style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }} placeholder="correo@ejemplo.com" />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "0.9rem" }}>Contraseña</label>
            <input type="password" name="password" required style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }} placeholder="••••••••" />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "0.9rem" }}>Rol</label>
            <select name="role" required style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc", background: "white" }}>
              <option value="BUYER">Comprador (BUYER)</option>
              <option value="VENDOR">Vendedor (VENDOR)</option>
              <option value="ADMIN">Administrador (ADMIN)</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
            <button type="button" onClick={() => setOpen(false)} style={{ flex: 1, padding: "10px", background: "#f3f4f6", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", color: "#4b5563" }}>
              Cancelar
            </button>
            <button type="submit" disabled={loading} style={{ flex: 1, padding: "10px", background: "#ff4747", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", color: "white" }}>
              {loading ? "Creando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
