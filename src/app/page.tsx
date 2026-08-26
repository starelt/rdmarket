import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

const CATS = ["Celulares","Electronica","Ropa Mujer","Ropa Hombre","Hogar","Zapatos","Deportes","Juguetes","Automotriz","Joyeria","Belleza","Libros","Videojuegos","Herramientas"];
const COUPONS = [
  { discount: "RD$200 OFF", minOrder: "Pedidos desde RD$2,000", color: "#ff4747" },
  { discount: "RD$500 OFF", minOrder: "Pedidos desde RD$5,000", color: "#c0392b" },
  { discount: "15% OFF", minOrder: "Tiendas seleccionadas", color: "#ff4747" },
];

export default async function Home() {
  const session = await auth();
  const products = await prisma.product.findMany({ take: 40, include: { store: true }, orderBy: { createdAt: "desc" } });
  const featured = products.slice(0, 5);
  const main = products.slice(5);

  return (
    <div style={{ background: "#f4f4f4", minHeight: "100vh" }}>

      <div style={{ background: "#111", color: "white", textAlign: "center", padding: "8px", fontSize: "0.85rem" }}>
        <strong>Aniversario RDMarket</strong> &mdash; Envio gratis sobre RD$2,000 | Hasta 70% OFF
      </div>

      <section style={{ background: "linear-gradient(135deg,#ff4747 0%,#c0392b 50%,#8B0000 100%)", position: "relative", overflow: "hidden", minHeight: "300px", display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", top: "-80px", right: "10%", width: "300px", height: "300px", background: "rgba(255,255,255,0.07)", borderRadius: "50%" }} />
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px 20px", width: "100%", display: "grid", gridTemplateColumns: "1fr auto", gap: "40px", alignItems: "center" }}>
          <div style={{ color: "white" }}>
            <h1 style={{ fontSize: "3rem", fontWeight: "900", margin: "0 0 10px 0", lineHeight: "1.1" }}>
              Gran Venta <span style={{ color: "#ffe066" }}>RDMarket</span>
            </h1>
            <p style={{ fontSize: "1.1rem", margin: "0 0 20px 0", opacity: 0.9 }}>Miles de productos de tiendas locales dominicanas con los mejores precios.</p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link href="/" style={{ background: "white", color: "#ff4747", padding: "12px 28px", borderRadius: "30px", textDecoration: "none", fontWeight: "900" }}>Comprar Ahora</Link>
              {!session && (
                <Link href="/register" style={{ border: "2px solid rgba(255,255,255,0.6)", color: "white", padding: "12px 28px", borderRadius: "30px", textDecoration: "none", fontWeight: "bold" }}>Unete Gratis</Link>
              )}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "16px", padding: "18px 24px", textAlign: "center", border: "1px solid rgba(255,255,255,0.2)" }}>
              <p style={{ color: "rgba(255,255,255,0.8)", margin: "0 0 10px 0", fontSize: "0.85rem" }}>Termina en:</p>
              <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                {[["12","HRS"],["45","MIN"],["30","SEG"]].map(([v,l]) => (
                  <div key={l} style={{ background: "#111", borderRadius: "8px", padding: "8px 12px", textAlign: "center", minWidth: "50px" }}>
                    <div style={{ color: "#ffe066", fontSize: "1.5rem", fontWeight: "900", lineHeight: 1 }}>{v}</div>
                    <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.6rem", marginTop: "2px" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
              {[["10K+","Productos"],["500+","Tiendas"],["50K+","Clientes"]].map(([n,l]) => (
                <div key={l} style={{ background: "rgba(255,255,255,0.15)", borderRadius: "10px", padding: "10px 6px", textAlign: "center" }}>
                  <div style={{ color: "white", fontWeight: "900" }}>{n}</div>
                  <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.65rem" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: "1400px", margin: "0 auto", padding: "16px 20px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px" }}>
          {COUPONS.map((c, i) => (
            <div key={i} style={{ background: "white", borderRadius: "12px", overflow: "hidden", display: "flex", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
              <div style={{ background: c.color, color: "white", padding: "14px 18px", minWidth: "120px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontSize: "1.3rem", fontWeight: "900" }}>{c.discount}</div>
                <div style={{ fontSize: "0.72rem", opacity: 0.9, marginTop: "4px" }}>{c.minOrder}</div>
              </div>
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "14px" }}>
                <button style={{ background: c.color, color: "white", border: "none", padding: "8px 18px", borderRadius: "20px", fontWeight: "bold", cursor: "pointer" }}>Reclamar</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: "1400px", margin: "0 auto", padding: "16px 20px 0" }}>
        <div style={{ background: "white", borderRadius: "16px", padding: "16px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", overflowX: "auto", gap: "4px" }}>
            {CATS.map((cat) => (
              <a key={cat} href="#" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", padding: "10px 14px", borderRadius: "10px", textDecoration: "none", color: "#444", whiteSpace: "nowrap", flexShrink: 0, minWidth: "70px" }}>
                <span style={{ fontSize: "1.5rem" }}>+</span>
                <span style={{ fontSize: "0.7rem", fontWeight: "600" }}>{cat}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section style={{ maxWidth: "1400px", margin: "0 auto", padding: "14px 20px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "10px" }}>
          {["Compra Segura","Envio Rapido","Devoluciones","Calidad Garantizada"].map((t) => (
            <div key={t} style={{ background: "white", borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <span style={{ fontSize: "1.5rem" }}>*</span>
              <div style={{ fontWeight: "700", fontSize: "0.82rem", color: "#111" }}>{t}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: "1400px", margin: "0 auto", padding: "16px 20px 0" }}>
        <div style={{ background: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <div style={{ background: "linear-gradient(90deg,#ff4747,#ff8900)", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h2 style={{ margin: 0, color: "white", fontWeight: "900", fontSize: "1.2rem" }}>
              Flash Deals &mdash; <span style={{ background: "rgba(0,0,0,0.3)", color: "#ffe066", padding: "3px 10px", borderRadius: "6px", fontSize: "0.82rem" }}>12:45:30</span>
            </h2>
            <a href="#" style={{ color: "white", textDecoration: "none", fontSize: "0.82rem" }}>Ver todo</a>
          </div>
          <div style={{ display: "flex", overflowX: "auto" }}>
            {(featured.length > 0 ? featured : [1,2,3,4,5]).map((p: any, i) => {
              const real = p && p.id;
              return (
                <Link key={real ? p.id : i} href={real ? "/product/" + p.id : "#"} style={{ textDecoration: "none", color: "inherit", minWidth: "190px", flex: 1, borderRight: "1px solid #f4f4f4" }}>
                  <div style={{ padding: "16px", textAlign: "center" }}>
                    {real && p.image ? (
                      <img src={p.image} alt={p.name} style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "8px", margin: "0 auto 10px" }} />
                    ) : (
                      <div style={{ width: "120px", height: "120px", background: "#f4f4f4", borderRadius: "8px", margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>RD</div>
                    )}
                    <div style={{ color: "#ff4747", fontWeight: "900", fontSize: "1.2rem" }}>{real ? "RD$" + p.price.toLocaleString() : "RD$99"}</div>
                    <div style={{ fontSize: "0.78rem", color: "#666", marginTop: "4px" }}>{real ? p.name : "Producto destacado"}</div>
                    <div style={{ marginTop: "8px", background: "#ff4747", color: "white", padding: "2px 10px", borderRadius: "12px", fontSize: "0.72rem", fontWeight: "bold", display: "inline-block" }}>OFERTA</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section style={{ maxWidth: "1400px", margin: "0 auto", padding: "16px 20px 60px", display: "grid", gridTemplateColumns: "220px 1fr", gap: "16px" }}>
        <div>
          <div style={{ background: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", position: "sticky", top: "90px" }}>
            <div style={{ background: "#ff4747", padding: "12px 16px" }}>
              <h3 style={{ margin: 0, color: "white", fontWeight: "900", fontSize: "0.95rem" }}>Categorias</h3>
            </div>
            <ul style={{ listStyle: "none", padding: "6px 0", margin: 0 }}>
              {CATS.map((cat) => (
                <li key={cat}>
                  <a href="#" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 16px", color: "#444", textDecoration: "none", fontSize: "0.87rem" }}>
                    <span>{cat}</span>
                    <span style={{ marginLeft: "auto", color: "#ddd" }}>›</span>
                  </a>
                </li>
              ))}
            </ul>
            <div style={{ margin: "8px", background: "#fff8f8", border: "1px solid #ffe0e0", borderRadius: "10px", padding: "12px" }}>
              <div style={{ color: "#ff4747", fontWeight: "800", fontSize: "0.85rem", marginBottom: "5px" }}>Proteccion al Comprador</div>
              <p style={{ fontSize: "0.75rem", color: "#999", margin: 0 }}>Reembolso garantizado si el articulo no llega o no es como se describe.</p>
            </div>
          </div>
        </div>
        <div>
          <div style={{ background: "white", borderRadius: "12px", padding: "10px 16px", marginBottom: "14px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", flexWrap: "wrap", gap: "8px" }}>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {["Relevancia","Mas Vendidos","Precio +","Precio -","Nuevo"].map((label, i) => (
                <button key={label} style={{ background: i === 0 ? "#ff4747" : "transparent", color: i === 0 ? "white" : "#666", border: i === 0 ? "none" : "1px solid #eee", padding: "5px 12px", borderRadius: "20px", cursor: "pointer", fontSize: "0.82rem" }}>
                  {label}
                </button>
              ))}
            </div>
            <span style={{ fontSize: "0.82rem", color: "#aaa" }}>{products.length} productos</span>
          </div>
          {products.length === 0 ? (
            <div style={{ textAlign: "center", color: "#bbb", padding: "60px 20px", background: "white", borderRadius: "16px" }}>
              <p>Aun no hay productos!</p>
              <Link href="/vendor/onboarding" style={{ background: "#ff4747", color: "white", padding: "10px 24px", borderRadius: "24px", textDecoration: "none", fontWeight: "bold", display: "inline-block", marginTop: "16px" }}>Empezar a Vender</Link>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(185px,1fr))", gap: "10px" }}>
              {(main.length > 0 ? main : products).map((p) => (
                <Link key={p.id} href={"/product/" + p.id} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{ background: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", height: "100%" }}>
                    <div style={{ position: "relative" }}>
                      {p.image ? (
                        <img src={p.image} alt={p.name} style={{ width: "100%", height: "185px", objectFit: "cover", display: "block" }} />
                      ) : (
                        <div style={{ width: "100%", height: "185px", background: "#f4f4f4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem" }}>RD</div>
                      )}
                      <div style={{ position: "absolute", top: 0, left: 0, background: "#ff4747", color: "white", padding: "2px 8px", borderRadius: "6px 0 6px 0", fontSize: "0.7rem", fontWeight: "bold" }}>-10%</div>
                    </div>
                    <div style={{ padding: "10px 12px 12px" }}>
                      <p style={{ margin: "0 0 6px 0", fontSize: "0.82rem", color: "#333", lineHeight: "1.35", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{p.name}</p>
                      <div style={{ color: "#ff4747", fontWeight: "900", fontSize: "1.1rem" }}>RD${p.price.toLocaleString()}</div>
                      <div style={{ marginTop: "4px", fontSize: "0.72rem", color: "#bbb" }}>200+ vendidos</div>
                      <div style={{ marginTop: "8px", fontSize: "0.72rem", color: "#999", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.store.name}</div>
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "24px", marginBottom: "24px" }}>
            {[{t:"RDMarket",i:["Sobre nosotros","Contacto","Trabaja"]},{t:"Compradores",i:["Como comprar","Proteccion","Devoluciones"]},{t:"Vendedores",i:["Vender aqui","Tarifas","Panel vendedor"]},{t:"Soporte",i:["Ayuda","Politicas","Reportar"]}].map((col) => (
              <div key={col.t}>
                <h4 style={{ margin: "0 0 12px 0", color: "#ff4747", fontSize: "0.88rem" }}>{col.t}</h4>
                {col.i.map(item => <a key={item} href="#" style={{ display: "block", color: "#aaa", textDecoration: "none", fontSize: "0.8rem", marginBottom: "6px" }}>{item}</a>)}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid #444", paddingTop: "16px", fontSize: "0.8rem", color: "#666", textAlign: "center" }}>
            2025 RDMarket - El Gran Mercado Local. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
