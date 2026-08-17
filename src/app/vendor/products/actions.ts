'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string, 10);
  const image = formData.get("image") as string;

  // Para pruebas: Crear un usuario y tienda dummy si la DB está vacía
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: { name: "Suplidor de Prueba", email: "suplidor@test.com", role: "VENDOR" }
    });
  }

  let store = await prisma.store.findFirst({ where: { ownerId: user.id } });
  if (!store) {
    store = await prisma.store.create({
      data: { name: "Mi Tienda Principal", ownerId: user.id }
    });
  }

  // Guardar en la base de datos real
  await prisma.product.create({
    data: {
      name,
      description,
      price,
      stock,
      image: image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      storeId: store.id
    }
  });

  // Refrescar vistas para que los cambios se vean al instante
  revalidatePath("/vendor/products");
  revalidatePath("/");
}
