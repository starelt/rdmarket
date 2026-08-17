import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProductAdminActions from "./ProductAdminActions";

export const dynamic = "force-dynamic";

export default async function StoreProductsAdminPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const store = await prisma.store.findUnique({
    where: { id: resolvedParams.id },
    include: { products: true }
  });

  if (!store) {
    return <div>Tienda no encontrada.</div>;
  }

  return (
    <div className="animate-fade-in-up">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", margin: 0 }}>📦 Productos de {store.name}</h1>
          <p style={{ color: "var(--text-muted)" }}>Modera los productos publicados por esta tienda.</p>
        </div>
        <Link href="/admin/users" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: "bold" }}>
          &larr; Volver
        </Link>
      </div>

      <div className="glass" style={{ padding: "2rem", borderRadius: "16px" }}>
        {store.products.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>Esta tienda no tiene productos publicados.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)" }}>
                <th style={{ padding: "1rem 0" }}>Producto</th>
                <th>Precio Base</th>
                <th>Precio Venta</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {store.products.map(product => (
                <tr key={product.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "1rem 0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      {product.image && (
                        <img src={product.image} alt={product.name} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }} />
                      )}
                      <div>
                        <div style={{ fontWeight: "bold" }}>{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td>RD$ {product.basePrice.toLocaleString()}</td>
                  <td>RD$ {product.price.toLocaleString()}</td>
                  <td>
                    <ProductAdminActions productId={product.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
