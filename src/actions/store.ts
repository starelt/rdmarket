"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getStoreForVendor() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("No estás autenticado");
  }

  // 1. Check if the user is a VENDOR
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { stores: true }
  });

  if (!user || user.role !== "VENDOR") {
    throw new Error("No tienes permisos de vendedor");
  }

  // 2. Return existing store or create a default one
  if (user.stores.length > 0) {
    return user.stores[0];
  }

  // Create a default store for the new vendor
  const newStore = await prisma.store.create({
    data: {
      name: `Tienda de ${user.name}`,
      description: "Tienda local en RDMarket",
      ownerId: user.id
    }
  });

  return newStore;
}
