import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await auth();
  
  // Fetch products instead of stores
  const products = await prisma.product.findMany({
    take: 24, // Limite de productos en la pagina principal
    include: {
      store: true,
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div style={{ background: "var(--bg-color)", minHeight: "100vh" }}>
      {/* AliExpress Hero Section */}
      <section className="container" style={{ paddingTop: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "250px 1fr 300px", gap: "20px" }}>
          
          {/* Categorias - Sidebar */}
          <div style={{ background: "white", borderRadius: "16px", padding: "10px 0", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <h3 style={{ padding: "10px 20px", margin: 0, fontSize: "1.1rem", borderBottom: "1px solid #eee" }}>Categorías</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {["📱 Celulares & Accesorios", "💻 Electrónica", "👗 Ropa de Mujer", "👕 Ropa de Hombre", "🏡 Hogar y Jardín", "👠 Zapatos", "⚽ Deportes", "👶 Juguetes", "🚗 Automotriz", "⌚ Joyería y Relojes"].map(cat => (
                <li key={cat}>
                  <a href="#" style={{ display: "block", padding: "10px 20px", color: "var(--text-color)", textDecoration: "none", fontSize: "0.9rem", transition: "background 0.2s" }} className="hover:bg-gray-100 hover:text-red-500">
                    {cat}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Banner Principal / Carousel */}
          <div style={{ background: "linear-gradient(90deg, #ff4747, #ff8900)", borderRadius: "16px", color: "white", padding: "40px", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "-50%", right: "-10%", width: "400px", height: "400px", background: "rgba(255,255,255,0.1)", borderRadius: "50%" }}></div>
            <h1 style={{ fontSize: "3rem", fontWeight: "900", margin: "0 0 10px 0", lineHeight: "1.1" }}>Día de Ofertas<br/>Locales</h1>
            <p style={{ fontSize: "1.2rem", margin: "0 0 20px 0" }}>Hasta 70% de descuento en miles de productos dominicanos.</p>
            <button style={{ background: "white", color: "#ff4747", border: "none", padding: "12px 30px", borderRadius: "30px", fontSize: "1.1rem", fontWeight: "bold", cursor: "pointer", width: "fit-content", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>Comprar Ahora</button>
          </div>

          {/* User Widget */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ background: "white", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", textAlign: "center" }}>
              <div style={{ width: "60px", height: "60px", background: "#f2f2f2", borderRadius: "50%", margin: "0 auto 10px auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
                {session ? "👋" : "👤"}
              </div>
              <p style={{ margin: "0 0 15px 0", fontWeight: "bold" }}>
                {session ? `Hola, ${session.user?.name?.split(' ')[0]}` : "Bienvenido a RDMarket"}
              </p>
              {!session && (
                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                  <Link href="/register" style={{ background: "var(--primary)", color: "white", padding: "8px 20px", borderRadius: "20px", textDecoration: "none", fontWeight: "bold", fontSize: "0.9rem" }}>Únete</Link>
                  <Link href="/login" style={{ background: "#f2f2f2", color: "var(--text-color)", padding: "8px 20px", borderRadius: "20px", textDecoration: "none", fontWeight: "bold", fontSize: "0.9rem" }}>Entrar</Link>
                </div>
              )}
            </div>

            <div style={{ background: "white", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
               <h4 style={{ margin: "0 0 10px 0", color: "#ff4747" }}>Protección al Comprador</h4>
               <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>Reembolso asegurado si el artículo no es entregado o no es como se describe.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Super Ofertas / Flash Deals */}
      <section className="container" style={{ marginTop: "30px" }}>
        <div style={{ background: "white", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "1.5rem", margin: 0, color: "#e62e2e", fontWeight: "900", fontStyle: "italic" }}>⚡ SuperDeals</h2>
            <div style={{ background: "#111", color: "white", padding: "4px 10px", borderRadius: "8px", fontWeight: "bold", fontSize: "0.9rem" }}>
              Termina en: 12:45:30
            </div>
          </div>
          
          <div style={{ display: "flex", gap: "20px", overflowX: "auto", paddingBottom: "10px" }}>
            {/* Simulando algunos productos en oferta */}
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} style={{ minWidth: "150px" }}>
                <div style={{ width: "150px", height: "150px", background: "#f2f2f2", borderRadius: "12px", marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "#ccc", fontSize: "3rem" }}>
                  📦
                </div>
                <div style={{ color: "#e62e2e", fontWeight: "bold", fontSize: "1.2rem" }}>RD$99</div>
                <div style={{ textDecoration: "line-through", color: "#999", fontSize: "0.85rem" }}>RD$500</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grid de Productos (More to Love) */}
      <section className="container" style={{ marginTop: "40px", paddingBottom: "60px" }}>
        <h2 style={{ fontSize: "1.8rem", textAlign: "center", marginBottom: "30px", fontWeight: "800", color: "#111" }}>Más para amar ❤️</h2>
        
        {products.length === 0 ? (
          <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px" }}>No hay productos disponibles por ahora.</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "15px" }}>
            {products.map(product => (
              <Link href={`/product/${product.id}`} key={product.id} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ background: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", transition: "transform 0.2s, box-shadow 0.2s" }} className="hover:scale-[1.03] hover:shadow-xl">
                  {product.image ? (
                    <img src={product.image} alt={product.name} style={{ width: "100%", height: "220px", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "220px", background: "#f2f2f2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4rem" }}>🛒</div>
                  )}
                  <div style={{ padding: "15px" }}>
                    <h3 style={{ fontSize: "0.95rem", margin: "0 0 10px 0", fontWeight: "normal", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: "1.4", height: "2.8em" }}>
                      {product.name}
                    </h3>
                    
                    <div style={{ display: "flex", alignItems: "baseline", gap: "5px" }}>
                      <span style={{ fontSize: "0.8rem", fontWeight: "bold" }}>RD$</span>
                      <span style={{ fontSize: "1.3rem", fontWeight: "900", color: "#111" }}>{product.price.toLocaleString()}</span>
                    </div>
                    
                    {product.basePrice > product.price && (
                      <div style={{ textDecoration: "line-through", color: "#999", fontSize: "0.8rem", marginTop: "2px" }}>
                        RD$ {product.basePrice.toLocaleString()}
                      </div>
                    )}

                    <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "5px" }}>
                       <span style={{ color: "#f59e0b", fontSize: "0.8rem" }}>★ 4.8</span>
                       <span style={{ color: "#999", fontSize: "0.8rem" }}>| 500+ vendidos</span>
                    </div>

                    <div style={{ marginTop: "10px", borderTop: "1px dashed #eee", paddingTop: "10px", fontSize: "0.75rem", color: "#666", display: "flex", alignItems: "center", gap: "5px" }}>
                      🏪 {product.store.name}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
