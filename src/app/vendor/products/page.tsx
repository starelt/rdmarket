import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AddProductForm from "./AddProductForm";
import ProductTableRow from "./ProductTableRow";

export const dynamic = "force-dynamic";

export default async function VendorProductsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const store = await prisma.store.findFirst({
    where: { ownerId: session.user.id }
  });

  if (!store) {
    return (
      <div className="container" style={{ padding: "4rem 20px", textAlign: "center" }}>
        <h2>Debes configurar tu tienda primero.</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>Antes de poder añadir productos, debes completar el registro legal de tu tienda y ser aprobado.</p>
        <a href="/vendor/onboarding" className="btn btn-primary" style={{ padding: "1rem 2rem", textDecoration: "none" }}>
          Ir a Configurar Mi Tienda
        </a>
      </div>
    );
  }

  const products = await prisma.product.findMany({
    where: { storeId: store.id },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="animate-fade-in-up">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", margin: 0 }}>📦 Inventario y Precios</h1>
          <p style={{ color: "var(--text-muted)", margin: "0.5rem 0 0 0" }}>Gestiona tu almacén y define tus ganancias.</p>
        </div>
        <AddProductForm storeId={store.id} />
      </div>

      <div className="glass" style={{ padding: "2rem", borderRadius: "16px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)" }}>
              <th style={{ padding: "1rem 0", width: "80px" }}>Img</th>
              <th>Producto</th>
              <th>Tu Ganancia</th>
              <th>Precio al Público</th>
              <th>Inventario</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
                  No tienes productos registrados.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <ProductTableRow key={product.id} product={product} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
