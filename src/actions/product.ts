"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createProduct(storeId: string, data: any) {
  try {
    const basePrice = parseFloat(data.basePrice);
    const taxRate = data.applyTax ? 0.18 : 0;
    const priceWithFee = basePrice * 1.10; // +10% RDMarket
    const finalPrice = priceWithFee * (1 + taxRate); // +18% ITBIS if applies
    
    await prisma.product.create({
      data: {
        storeId,
        name: data.name,
        description: data.description,
        netCost: parseFloat(data.netCost) || 0,
        basePrice,
        taxRate,
        price: finalPrice,
        stock: parseInt(data.stock),
        image: data.image || "https://images.unsplash.com/photo-1550009158-9effb619a647?auto=format&fit=crop&w=800&q=80",
        isActive: true
      }
    });

    revalidatePath("/vendor/products");
    revalidatePath("/store/[id]");
    return { success: true };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, message: "No se pudo crear el producto." };
  }
}

export async function toggleProductStatus(productId: string, currentStatus: boolean) {
  try {
    await prisma.product.update({
      where: { id: productId },
      data: { isActive: !currentStatus }
    });
    revalidatePath("/vendor/products");
    revalidatePath("/store/[id]");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function deleteProduct(productId: string) {
  try {
    await prisma.product.delete({
      where: { id: productId }
    });
    revalidatePath("/vendor/products");
    revalidatePath("/store/[id]");
    return { success: true };
  } catch (error) {
    return { success: false, message: "No se pudo eliminar." };
  }
}
