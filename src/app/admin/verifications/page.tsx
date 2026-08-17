import { prisma } from "@/lib/prisma";
import VerificationActions from "./VerificationActions";

export const dynamic = "force-dynamic";

export default async function AdminVerificationsPage() {
  const pendingStores = await prisma.store.findMany({
    where: { status: "PENDING" },
    include: { owner: true }
  });

  return (
    <div className="animate-fade-in-up">
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem" }}>🔍 Solicitudes de Verificación (KYC)</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "3rem" }}>
        Revisa la autenticidad de las tiendas antes de permitirles vender en la plataforma.
      </p>

      {pendingStores.length === 0 ? (
        <div style={{ background: "var(--card-bg)", padding: "3rem", borderRadius: "16px", textAlign: "center" }}>
          <span style={{ fontSize: "3rem" }}>🎉</span>
          <h2 style={{ marginTop: "1rem" }}>¡Todo al día!</h2>
          <p style={{ color: "var(--text-muted)" }}>No hay solicitudes pendientes de revisión.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
          {pendingStores.map((store) => (
            <div key={store.id} style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "16px", padding: "2rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
              
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: "1.5rem" }}>{store.name}</h2>
                  <p style={{ color: "var(--text-muted)", margin: "0.5rem 0 0 0" }}>Dueño: {store.owner.name} ({store.owner.email})</p>
                  <p style={{ color: "var(--text-muted)", margin: "0.2rem 0 0 0" }}>Tel: {store.phoneNumber || "No provisto"}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ background: "var(--accent)", color: "white", padding: "0.5rem 1rem", borderRadius: "8px", fontWeight: "bold" }}>EN REVISIÓN</span>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", color: "var(--primary)" }}>Documento de Identidad</h3>
                  <div style={{ width: "100%", height: "200px", background: "#222", borderRadius: "12px", border: "1px dashed #555", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "#888" }}>Vista Previa de Cédula/Pasaporte</span>
                  </div>
                </div>
                
                <div>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", color: "#ef4444" }}>Prueba en Video (Local/Inventario)</h3>
                  <div style={{ width: "100%", height: "200px", background: "#000", borderRadius: "12px", border: "1px solid #333", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    <span style={{ fontSize: "3rem" }}>▶️</span>
                    <span style={{ position: "absolute", bottom: "10px", right: "10px", background: "rgba(0,0,0,0.8)", padding: "2px 8px", borderRadius: "4px", fontSize: "0.8rem" }}>01:45</span>
                  </div>
                </div>
              </div>

              <div style={{ background: "rgba(255,255,255,0.05)", padding: "1.5rem", borderRadius: "12px" }}>
                <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Ubicación Declarada</h3>
                <p style={{ color: "var(--text-muted)", margin: 0 }}>{store.exactLocation || "Sin ubicación registrada"}</p>
              </div>

              <VerificationActions storeId={store.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
