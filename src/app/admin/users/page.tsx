import { prisma } from "@/lib/prisma";
import UserRow from "./UserRow";
import CreateUserModal from "./CreateUserModal";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: { stores: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="animate-fade-in-up">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", margin: 0, color: "#111" }}>👥 Gestión de Usuarios y Tiendas</h1>
        <CreateUserModal />
      </div>
      <p style={{ color: "var(--text-muted)", marginBottom: "3rem" }}>
        Administra todas las cuentas registradas en la plataforma. Puedes suspender tiendas o eliminar usuarios.
      </p>

      <div style={{ background: "white", padding: "2rem", borderRadius: "16px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #eee", color: "#666" }}>
              <th style={{ padding: "1rem 0" }}>Usuario</th>
              <th>Rol</th>
              <th>Tienda Vinculada</th>
              <th>Estado KYC</th>
              <th>Acciones Peligrosas</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const store = user.stores[0]; // Asumimos 1 tienda por usuario por ahora
              return <UserRow key={user.id} user={user} store={store} />;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
