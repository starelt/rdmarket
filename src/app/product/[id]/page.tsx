import { prisma } from "@/lib/prisma";

export default async function ProductDetail({ params }: { params: { id: string } }) {
  // Fetch real data from Prisma
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { store: true }
  });

  if (!product) {
    return (
      <div className="container" style={{ marginTop: "4rem", textAlign: "center" }}>
        <h1>Producto no encontrado</h1>
        <p>El artículo que buscas ya no está disponible.</p>
        <a href="/" className="btn btn-primary" style={{ marginTop: "1rem" }}>Volver al catálogo</a>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: "2rem" }}>
      <div className="glass" style={{ padding: "2rem", display: "flex", gap: "3rem", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 400px" }}>
          <img 
            src={product.image || ""} 
            alt={product.name} 
            style={{ width: "100%", borderRadius: "12px", objectFit: "cover", height: "400px" }} 
          />
        </div>
        <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h4 style={{ color: "var(--primary)", marginBottom: "0.5rem" }}>🏪 {product.store.name}</h4>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{product.name}</h1>
          <p style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1.5rem" }}>RD$ {product.price.toFixed(2)}</p>
          <p style={{ color: "var(--text-muted)", marginBottom: "2rem", lineHeight: "1.6" }}>{product.description}</p>
          
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <span style={{ fontWeight: "600" }}>Disponibilidad:</span>
            <span style={{ color: "green" }}>{product.stock} en inventario</span>
          </div>
          
          <a href="/cart" className="btn btn-primary" style={{ marginTop: "2rem", padding: "15px", fontSize: "1.2rem", textAlign: "center" }}>
            🛒 Añadir al Carrito
          </a>
        </div>
      </div>
    </div>
  );
}
