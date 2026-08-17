import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const stores = await prisma.store.findMany({
    include: {
      products: {
        take: 3, // Tomamos 3 productos de muestra para mostrar en la card de la tienda
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div style={{ paddingBottom: "4rem" }}>
      {/* Search Header Estilo PedidosYa */}
      <section style={{ background: "linear-gradient(135deg, var(--primary), #1e3a8a)", padding: "3rem 1.5rem", borderRadius: "0 0 24px 24px", color: "white" }}>
        <div className="container">
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Lo mejor en Tecnología,<br/>directo a tu puerta 🚀</h1>
          <div style={{ display: "flex", gap: "1rem", background: "white", padding: "0.5rem", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
            <span style={{ padding: "0.8rem", color: "#666" }}>📍 Entregar en: Santo Domingo</span>
            <input 
              type="text" 
              placeholder="¿Qué buscas? (ej. iPhone 15, Laptop Dell...)" 
              style={{ flex: 1, border: "none", outline: "none", fontSize: "1rem", color: "#000", padding: "0.8rem", background: "#f3f4f6", borderRadius: "8px" }}
            />
            <button className="btn btn-primary" style={{ padding: "0.8rem 2rem", borderRadius: "8px" }}>Buscar</button>
          </div>
        </div>
      </section>

      <div className="container" style={{ marginTop: "2rem" }}>
        {/* Categorías (Scroll Horizontal) */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Categorías</h2>
          <div style={{ display: "flex", gap: "1rem", overflowX: "auto", paddingBottom: "1rem" }}>
            {["📱 Celulares", "💻 Laptops", "🎧 Audio", "⌚ Smartwatches", "📺 TVs", "🎮 Gaming", "🔌 Cables"].map(cat => (
              <div key={cat} style={{ background: "var(--card-bg)", padding: "1rem 2rem", borderRadius: "50px", border: "1px solid var(--border)", whiteSpace: "nowrap", cursor: "pointer", fontWeight: "bold" }}>
                {cat}
              </div>
            ))}
          </div>
        </section>

        {/* Tiendas Destacadas */}
        <section>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>Tiendas Destacadas</h2>
          
          {stores.length === 0 ? (
            <p style={{ color: "var(--text-muted)", background: "var(--card-bg)", padding: "2rem", borderRadius: "12px", textAlign: "center" }}>
              Aún no hay tiendas registradas. ¡Sé el primero en vender!
            </p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "2rem" }}>
              {stores.map(store => (
                <Link href={`/store/${store.id}`} key={store.id} style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="card hover-scale" style={{ borderRadius: "16px", overflow: "hidden", display: "flex", flexDirection: "column", background: "var(--card-bg)", border: "1px solid var(--border)", cursor: "pointer" }}>
                    
                    {/* Banner */}
                    <div style={{ height: "140px", background: "#333", backgroundImage: `url(${store.bannerImage || 'https://images.unsplash.com/photo-1550009158-9ffb6e9a165d?auto=format&fit=crop&w=800&q=80'})`, backgroundSize: "cover", backgroundPosition: "center", position: "relative" }}>
                      {/* Logo flotante estilo PedidosYa */}
                      <div style={{ position: "absolute", bottom: "-20px", left: "20px", width: "60px", height: "60px", borderRadius: "12px", background: "white", border: "3px solid var(--card-bg)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                        {store.logo ? (
                          <img src={store.logo} alt={store.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <span style={{ fontSize: "1.5rem", color: "var(--primary)", fontWeight: "bold" }}>{store.name.charAt(0)}</span>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ padding: "2rem 1.5rem 1.5rem 1.5rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", margin: 0 }}>{store.name}</h3>
                          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "4px" }}>
                            {store.description || "Electrónica y Accesorios"}
                          </p>
                        </div>
                        <span style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981", padding: "4px 8px", borderRadius: "8px", fontWeight: "bold", fontSize: "0.85rem" }}>
                          ⭐ 4.8
                        </span>
                      </div>
                      
                      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                        <span>🛵 Envío RD$250</span>
                        <span>•</span>
                        <span>⏱️ 24-48 hrs</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
