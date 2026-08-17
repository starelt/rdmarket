import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const store = await prisma.store.findFirst({
    where: { ownerId: session.user.id }
  });

  if (!store) {
    return (
      <div className="container" style={{ padding: "4rem 20px", textAlign: "center" }}>
        <h2>Debes configurar tu tienda primero.</h2>
        <a href="/vendor/onboarding" className="btn btn-primary" style={{ padding: "1rem 2rem", textDecoration: "none" }}>
          Ir a Configurar Mi Tienda
        </a>
      </div>
    );
  }

  return <SettingsForm store={store} />;
}
