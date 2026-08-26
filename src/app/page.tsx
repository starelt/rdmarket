import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

const CATEGORIES = [
  { icon: "📱", name: "Celulares" },
  { icon: "💻", name: "Electrónica" },
  { icon: "👗", name: "Ropa Mujer" },
  { icon: "👕", name: "Ropa Hombre" },
  { icon: "🏡", name: "Hogar" },
  { icon: "👠", name: "Zapatos" },
  { icon: "⚽", name: "Deportes" },
  { icon: "👶", name: "Juguetes" },
  { icon: "🚗", name: "Automotriz" },
  { icon: "⌚", name: "Joyería" },
  { icon: "💄", name: "Belleza" },
  { icon: "📚", name: "Libros" },
  { icon: "🎮", name: "Videojuegos" },
  { icon: "🛠️", name: "Herramientas" },
];

const COUPON_DEALS = [
  { discount: "RD$200 OFF", minOrder: "Pedidos desde RD$2,000", color: "#ff4747" },
  { discount: "RD$500 OFF", minOrder: "Pedidos desde RD$5,000", color: "#c0392b" },
  { discount: "15% OFF", minOrder: "Tiendas seleccionadas", color: "#ff4747" },
];

export default async function Home() {
  const session = await auth();
  
  const products = await prisma.product.findMany({
    take: 40,
    include: { store: true },
    orderBy: { createdAt: "desc" }
  });

  const featuredProducts = products.slice(0, 5);
  const mainProducts = products.slice(5);

  return (
    <div style={{ background: "#f4f4f4", minHeight: "100vh" }}>

      {/* TOP PROMO BAR */}
      <div style={{ background: "#111", color: "white", textAlign: "center", padding: "8px", fontSize: "0.85rem" }}>
        🎉 <strong>Aniversario RDMarket</strong> — Envío gratis en pedidos sobre RD$2,000 | Hasta 70% OFF
      </div>

      {/* HERO BANNER */}
      <section style={{
        background: "linear-gradient(135deg, #ff4747 0%, #c0392b 50%, #8B0000 100%)",
        padding: "0",
        position: "relative",
        overflow: "hidden",
        minHeight: "300px",
        display: "flex",
        alignItems: "center"
      }}>
        <div style={{ position: "absolute", top: "-80px", right: "10%", width: "300px", height: "300px", background: "rgba(255,255,255,0.07)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "-100px", left: "5%", width: "250px", height: "250px", background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />

        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px 20px", width: "100%", display: "grid", gridTemplateColumns: "1fr auto", gap: "40px", alignItems: "center" }}>
          <div style={{ color: "white" }}>
            <div style={{ background: "rgba(255,255,255,0.2)", display: "inline-block", padding: "4px 14px", borderRadius: "20px", fontSize: "0.82rem", fontWeight: "bold", marginBottom: "14px" }}>
              ⚡ Oferta por tiempo limitado
            </div>
            <h1 style={{ fontSize: "3.2rem", fontWeight: "900", margin: "0 0 10px 0", lineHeight: "1.1", textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>
              Gran Venta <span style={{ color: "#ffe066" }}>RDMarket</span>
            </h1>
            <p style={{ fontSize: "1.1rem", margin: "0 0 22px 0", opacity: 0.9 }}>
              Miles de productos de tiendas locales dominicanas con los mejores precios.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link href="/login" style={{ background: "white", color: "#ff4747", padding: "12px 28px", borderRadius: "30px", textDecoration: "none", fontWeight: "900", fontSize: "1rem", boxShadow: "0 4px 15px rgba(0,0,0,0.2)" }}>
                Comprar Ahora
              </Link>
              {!session && (
                <Link href="/register" style={{ background: "transparent", color: "white", padding: "12px 28px", borderRadius: "30px", textDecoration: "none", fontWeight: "bold", fontSize: "1rem", border: "2px solid rgba(255,255,255,0.6)" }}>
                  Únete Gratis
                </Link>
              )}
            </div>
          </div>

          {/* Countdown + Stats */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "16px", padding: "18px 24px", textAlign: "center", border: "1px solid rgba(255,255,255,0.2)" }}>
              <p style={{ color: "rgba(255,255,255,0.8)", margin: "0 0 10px 0", fontSize: "0.85rem" }}>⏰ Termina en:</p>
              <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                {[["12", "HRS"], ["45", "MIN"], ["30", "SEG"]].map(([val, label]) => (
                  <div key={label} style={{ background: "#111", borderRadius: "8px", padding: "8px 12px", minWidth: "50px", textAlign: "center" }}>
                    <div style={{ color: "#ffe066", fontSize: "1.5rem", fontWeight: "900", lineHeight: 1 }}>{val}</div>
                    <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.6rem", marginTop: "2px" }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
              {[["10K+", "Productos"], ["500+", "Tiendas"], ["50K+", "Clientes"]].map(([num, label]) => (
                <div key={label} style={{ background: "rgba(255,255,255,0.15)", borderRadius: "10px", padding: "10px 6px", textAlign: "center", border: "1px solid rgba(255,255,255,0.15)" }}>
                  <div style={{ color: "white", fontWeight: "900", fontSize: "1.1rem" }}>{num}</div>
                  <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.65rem" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COUPON ROW */}
      <section style={{ maxWidth: "1400px", margin: "0 auto", padding: "16px 20px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
          {COUPON_DEALS.map((coupon, i) => (
            <div key={i} style={{ background: "white", borderRadius: "12px", overflow: "hidden", display: "flex", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
              <div style={{ background: coupon.color, color: "white", padding: "14px 18px", minWidth: "120px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontSize: "1.3rem", fontWeight: "900" }}>{coupon.discount}</div>
                <div style={{ fontSize: "0.72rem", opacity: 0.9, marginTop: "4px" }}>{coupon.minOrder}</div>
              </div>
              <div style={{ width: "1px", background: `${coupon.color}44` }} />
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "14px" }}>
                <button style={{ background: coupon.color, color: "white", border: "none", padding: "8px 18px", borderRadius: "20px", fontWeight: "bold", cursor: "pointer", fontSize: "0.85rem" }}>
                  Reclamar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORY ICONS */}
      <section style={{ maxWidth: "1400px", margin: "0 auto", padding: "16px 20px 0" }}>
        <div style={{ background: "white", borderRadius: "16px", padding: "16px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", overflowX: "auto", gap: "4px", paddingBottom: "4px" }}>
            {CATEGORIES.map((cat) => (
              <a key={cat.name} href="#" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", padding: "10px 12px", borderRadius: "10px", textDecoration: "none", color: "#444", whiteSpace: "nowrap", flexShrink: 0, minWidth: "68px", transition: "all 0.15s" }}
                className="hover:bg-red-50 hover:text-red-500">
                <span style={{ fontSize: "1.7rem" }}>{cat.icon}</span>
                <span style={{ fontSize: "0.7rem", fontWeight: "600" }}>{cat.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section style={{ maxWidth: "1400px", margin: "0 auto", padding: "14px 20px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
          {[
            { icon: "🛡️", title: "Compra Segura", desc: "Pago protegido 100%" },
            { icon: "🚚", title: "Envío Rápido", desc: "Entrega en 24-48h" },
            { icon: "↩️", title: "Devoluciones", desc: "Hasta 15 días" },
            { icon: "⭐", title: "Calidad Garantizada", desc: "Tiendas verificadas" },
          ].map((badge) => (
            <div key={badge.title} style={{ background: "white", borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <span style={{ fontSize: "1.7rem" }}>{badge.icon}</span>
              <div>
                <div style={{ fontWeight: "700", fontSize: "0.82rem", color: "#111" }}>{badge.title}</div>
                <div style={{ fontSize: "0.72rem", color: "#999", marginTop: "2px" }}>{badge.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FLASH DEALS / FEATURED */}
      <section style={{ maxWidth: "1400px", margin: "0 auto", padding: "16px 20px 0" }}>
        <div style={{ background: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <div style={{ background: "linear-gradient(90deg, #ff4747, #ff8900)", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "1.2rem" }}>⚡</span>
              <h2 style={{ margin: 0, color: "white", fontWeight: "900", fontSize: "1.2rem" }}>Flash Deals</h2>
              <div style={{ background: "rgba(0,0,0,0.3)", color: "#ffe066", padding: "3px 10px", borderRadius: "6px", fontWeight: "bold", fontSize: "0.82rem" }}>
                12:45:30
              </div>
            </div>
            <a href="#" style={{ color: "white", textDecoration: "none", fontSize: "0.82rem", opacity: 0.85 }}>Ver todo →</a>
          </div>

          <div style={{ display: "flex", overflowX: "auto" }}>
            {(featuredProducts.length > 0 ? featuredProducts : [1,2,3,4,5]).map((product: any, i) => {
              const isReal = typeof product === "object" && product.id;
              return (
                <Link key={isReal ? product.id : i} href={isReal ? `/product/${product.id}` : "#"} style={{ textDecoration: "none", color: "inherit", minWidth: "190px", flex: 1, borderRight: "1px solid #f4f4f4" }}>
                  <div style={{ padding: "16px", textAlign: "center" }}>
                    {isReal && product.image ? (
                      <img src={product.image} alt={product.name} style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "8px", margin: "0 auto 10px" }} />
                    ) : (
                      <div style={{ width: "120px", height: "120px", background: "#f4f4f4", borderRadius: "8px", margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem" }}>🛒</div>
                    )}
                    <div style={{ color: "#ff4747", fontWeight: "900", fontSize: "1.2rem" }}>
                      {isReal ? `RD$${product.price.toLocaleString()}` : "RD$99"}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#666", marginTop: "4px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                      {isReal ? product.name : "Producto destacado"}
                    </div>
                    <div style={{ marginTop: "8px", background: "#ff4747", color: "white", padding: "2px 10px", borderRadius: "12px", fontSize: "0.72rem", fontWeight: "bold", display: "inline-block" }}>
                      OFERTA
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* MAIN: SIDEBAR + PRODUCT GRID */}
      <section style={{ maxWidth: "1400px", margin: "0 auto", padding: "16px 20px 60px", display: "grid", gridTemplateColumns: "220px 1fr", gap: "16px" }}>
        
        {/* SIDEBAR */}
        <div>
          <div style={{ background: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", position: "sticky", top: "90px" }}>
            <div style={{ background: "#ff4747", padding: "12px 16px" }}>
              <h3 style={{ margin: 0, color: "white", fontWeight: "900", fontSize: "0.95rem" }}>≡ Categorías</h3>
            </div>
            <ul style={{ listStyle: "none", padding: "6px 0", margin: 0 }}>
              {CATEGORIES.map((cat) => (
                <li key={cat.name}>
                  <a href="#" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 16px", color: "#444", textDecoration: "none", fontSize: "0.87rem", transition: "all 0.15s" }}
                    className="hover:bg-red-50 hover:text-red-500">
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                    <span style={{ marginLeft: "auto", color: "#ddd", fontSize: "0.75rem" }}>›</span>
                  </a>
                </li>
              ))}
            </ul>
            <div style={{ margin: "8px", background: "#fff8f8", border: "1px solid #ffe0e0", borderRadius: "10px", padding: "12px" }}>
              <div style={{ color: "#ff4747", fontWeight: "800", fontSize: "0.85rem", marginBottom: "5px" }}>🛡️ Protección al Comprador</div>
              <p style={{ fontSize: "0.75rem", color: "#999", margin: 0, lineHeight: 1.5 }}>
                Reembolso garantizado si el artículo no llega o no es como se describe.
              </p>
            </div>
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div>
          {/* Sort bar */}
          <div style={{ background: "white", borderRadius: "12px", padding: "10px 16px", marginBottom: "14px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", gap: "8px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {["Relevancia", "Más Vendidos", "Precio ↑", "Precio ↓", "Nuevo"].map((label, i) => (
                <button key={label} style={{ background: i === 0 ? "#ff4747" : "transparent", color: i === 0 ? "white" : "#666", border: i === 0 ? "none" : "1px solid #eee", padding: "5px 12px", borderRadius: "20px", cursor: "pointer", fontSize: "0.82rem", fontWeight: i === 0 ? "bold" : "normal" }}>
                  {label}
                </button>
              ))}
            </div>
            <span style={{ fontSize: "0.82rem", color: "#aaa" }}>{products.length} productos</span>
          </div>

          {products.length === 0 ? (
            <div style={{ textAlign: "center", color: "#bbb", padding: "60px 20px", background: "white", borderRadius: "16px" }}>
              <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🛒</div>
              <p>Aún no hay productos. ¡Sé el primero en publicar!</p>
              <Link href="/vendor/onboarding" style={{ background: "#ff4747", color: "white", padding: "10px 24px", borderRadius: "24px", textDecoration: "none", fontWeight: "bold", marginTop: "16px", display: "inline-block" }}>
                Empezar a Vender
              </Link>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(185px, 1fr))", gap: "10px" }}>
              {(mainProducts.length > 0 ? mainProducts : products).map((product) => (
                <Link key={product.id} href={`/product/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{ background: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", transition: "transform 0.2s, box-shadow 0.2s", height: "100%" }} className="hover:scale-[1.02] hover:shadow-lg">
                    <div style={{ position: "relative" }}>
                      {product.image ? (
                        <img src={product.image} alt={product.name} style={{ width: "100%", height: "185px", objectFit: "cover", display: "block" }} />
                      ) : (
                        <div style={{ width: "100%", height: "185px", background: "#f4f4f4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3.5rem" }}>🛒</div>
                      )}
                      <div style={{ position: "absolute", top: "0", left: "0", background: "#ff4747", color: "white", padding: "2px 8px", borderRadius: "6px 0 6px 0", fontSize: "0.7rem", fontWeight: "bold" }}>
                        -10%
                      </div>
                    </div>
                    <div style={{ padding: "10px 12px 12px" }}>
                      <p style={{ margin: "0 0 6px 0", fontSize: "0.82rem", color: "#333", lineHeight: "1.35", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {product.name}
                      </p>
                      <div style={{ color: "#ff4747", fontWeight: "900", fontSize: "1.1rem" }}>RD${product.price.toLocaleString()}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.72rem", marginTop: "4px" }}>
                        <span style={{ color: "#f59e0b" }}>★★★★★</span>
                        <span style={{ color: "#bbb" }}>| 200+ vendidos</span>
                      </div>
                      <div style={{ marginTop: "8px", fontSize: "0.72rem", color: "#999", display: "flex", gap: "4px", alignItems: "center" }}>
                        <span>🏪</span>
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.store.name}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

                      </p>
                      <div style={{ color: "#ff4747", fontWeight: "900", fontSize: "1.1rem" }}>RD${product.price.toLocaleString()}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.72rem", marginTop: "4px" }}>
                        <span style={{ color: "#f59e0b" }}>?????</span>
                        <span style={{ color: "#bbb" }}>| 200+ vendidos</span>
                      </div>
                      <div style={{ marginTop: "8px", fontSize: "0.72rem", color: "#999", display: "flex", gap: "4px", alignItems: "center" }}>
                        <span>??</span>
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.store.name}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer style={{ background: "#222", color: "white", padding: "30px 20px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", marginBottom: "24px" }}>
            {[
              { title: "RDMarket", items: ["Sobre nosotros", "Contacto", "Trabaja con nosotros"] },
              { title: "Compradores", items: ["C�mo comprar", "Protecci�n al comprador", "Devoluciones"] },
              { title: "Vendedores", items: ["Vender aqu�", "Tarifas y comisiones", "Panel de vendedor"] },
              { title: "Soporte", items: ["Centro de ayuda", "Pol�ticas", "Reportar un problema"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 style={{ margin: "0 0 12px 0", color: "#ff4747", fontSize: "0.88rem" }}>{col.title}</h4>
                {col.items.map(item => (
                  <a key={item} href="#" style={{ display: "block", color: "#aaa", textDecoration: "none", fontSize: "0.8rem", marginBottom: "6px" }}>{item}</a>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid #444", paddingTop: "16px", fontSize: "0.8rem", color: "#666", textAlign: "center" }}>
            � 2025 RDMarket � El Gran Mercado Local de Rep�blica Dominicana. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
