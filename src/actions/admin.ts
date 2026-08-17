"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== "ADMIN") {
    throw new Error("Acceso denegado: Se requiere rol de administrador");
  }
  return session.user;
}

export async function suspendStore(storeId: string) {
  await requireAdmin();
  await prisma.store.update({
    where: { id: storeId },
    data: { status: "SUSPENDED" }
  });
  revalidatePath("/admin/users");
  revalidatePath(`/store/${storeId}`);
}

export async function activateStore(storeId: string) {
  await requireAdmin();
  await prisma.store.update({
    where: { id: storeId },
    data: { status: "APPROVED" }
  });
  revalidatePath("/admin/users");
  revalidatePath("/admin/verifications");
  revalidatePath(`/store/${storeId}`);
}

export async function rejectStore(storeId: string) {
  await requireAdmin();
  await prisma.store.update({
    where: { id: storeId },
    data: { status: "REJECTED" }
  });
  revalidatePath("/admin/users");
  revalidatePath("/admin/verifications");
}

export async function deleteProductAdmin(productId: string) {
  await requireAdmin();
  
  // Borrar lógicamente o físicamente. Optamos por borrar físicamente si no tiene órdenes asociadas.
  // Para evitar errores de ForeignKey, verificamos si tiene OrderItems.
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { orderItems: true }
  });

  if (!product) throw new Error("Producto no encontrado");

  if (product.orderItems.length > 0) {
    // Si ya ha sido vendido, no lo podemos borrar físicamente sin romper el historial,
    // así que lo ocultamos cambiando su status o poniéndolo inactivo (podríamos agregar un campo, pero usaremos el precio o lo eliminamos en cascada).
    // Lo mejor es borrarlo igual pero en un diseño real usaríamos Soft Delete. 
    // Para simplificar: borramos todos los OrderItems asociados a este producto? NO. 
    // Añadiremos un "isDeleted" o simplemente dejaremos que tire error.
    // Vamos a agregar un try catch y devolver el error.
    try {
      await prisma.product.delete({ where: { id: productId } });
    } catch (e) {
      throw new Error("No se puede eliminar un producto que ya tiene ventas registradas.");
    }
  } else {
    await prisma.product.delete({
      where: { id: productId }
    });
  }

  revalidatePath("/admin/users");
  revalidatePath("/");
}

export async function addPenalty(storeId: string, amount: number) {
  await requireAdmin();
  await prisma.store.update({
    where: { id: storeId },
    data: {
      penaltyBalance: {
        increment: amount
      }
    }
  });
  revalidatePath("/admin/users");
}
