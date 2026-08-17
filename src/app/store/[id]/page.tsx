import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function StorePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const store = await prisma.store.findUnique({
    where: { id: resolvedParams.id },
    include: {
      products: true,
    }
  });

  if (!store) return notFound();

  // Agrupar productos por categoría simulada (usando description por ahora)
  const categories = Array.from(new Set(store.products.map(p => p.description || "General")));

  return (
    <div style={{ paddingBottom: "4rem" }}>
      {/* Header gigante estilo PedidosYa */}
      <section style={{ height: "300px", background: "#333", backgroundImage: `url(${store.bannerImage || 'https://images.unsplash.com/photo-1550009158-9ffb6e9a165d?auto=format&fit=crop&w=1200&q=80'})`, backgroundSize: "cover", backgroundPosition: "center", position: "relative" }}>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.8))", padding: "2rem", display: "flex", gap: "2rem", alignItems: "flex-end" }}>
          <div style={{ width: "100px", height: "100px", borderRadius: "16px", background: "white", border: "4px solid var(--card-bg)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            {store.logo ? (
              <img src={store.logo} alt={store.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: "2.5rem", color: "var(--primary)", fontWeight: "bold" }}>{store.name.charAt(0)}</span>
            )}
          </div>
          <div style={{ color: "white" }}>
            <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", margin: 0 }}>{store.name}</h1>
            <p style={{ color: "#e5e7eb", fontSize: "1.1rem", marginTop: "4px" }}>
              {store.description || "Electrónica y Accesorios"} • ⭐ 4.8
            </p>
          </div>
        </div>
      </section>

      <div className="container" style={{ marginTop: "3rem" }}>
        {/* Sello de Confianza KYC */}
        {store.status === "APPROVED" && (
          <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid #10b981", padding: "1rem", borderRadius: "12px", display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
            <span style={{ fontSize: "2rem" }}>🛡️</span>
            <div>
              <p style={{ color: "#10b981", fontWeight: "bold", margin: 0, fontSize: "1.1rem" }}>Asegurado por RDMarket</p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0 }}>Esta tienda ha pasado exitosamente nuestra rigurosa verificación de identidad y ubicación física. Tu compra es segura.</p>
            </div>
          </div>
        )}

        {/* Fotos de confianza del vendedor */}
        <div style={{ display: "flex", gap: "2rem", marginBottom: "3rem" }}>
          {store.ownerPhoto && (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", background: "var(--card-bg)", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border)" }}>
              <img src={store.ownerPhoto} alt="Dueño" style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover" }} />
              <div>
                <p style={{ fontWeight: "bold", margin: 0 }}>Propietario</p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: 0 }}>Vendedor Verificado</p>
              </div>
            </div>
          )}
          {store.teamPhoto && (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", background: "var(--card-bg)", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border)" }}>
              <img src={store.teamPhoto} alt="Equipo" style={{ width: "100px", height: "60px", borderRadius: "8px", objectFit: "cover" }} />
              <div>
                <p style={{ fontWeight: "bold", margin: 0 }}>Nuestro Equipo</p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: 0 }}>Listos para despachar</p>
              </div>
            </div>
          )}
        </div>

        {/* Productos organizados por categorías */}
        {categories.map(category => (
          <section key={category} style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}>{category}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
              {store.products.filter(p => (p.description || "General") === category).map(product => (
                <div key={product.id} className="card hover-scale" style={{ display: "flex", gap: "1rem", padding: "1rem", borderRadius: "12px", background: "var(--card-bg)", border: "1px solid var(--border)", cursor: "pointer" }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", margin: "0 0 0.5rem 0" }}>{product.name}</h3>
                    <p style={{ color: "var(--primary)", fontWeight: "bold", margin: "0 0 1rem 0" }}>RD$ {product.price.toFixed(2)}</p>
                    <button className="btn btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}>+ Añadir</button>
                  </div>
                  <img src={product.image || ""} alt={product.name} style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }} />
                </div>
              ))}
            </div>
          </section>
        ))}
        
        {store.products.length === 0 && (
          <p style={{ color: "var(--text-muted)", textAlign: "center" }}>Esta tienda aún no tiene productos disponibles.</p>
        )}
      </div>
    </div>
  );
}
