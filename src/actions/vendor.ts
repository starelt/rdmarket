"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function updateStoreSettings(storeId: string, data: any) {
  try {
    await prisma.store.update({
      where: { id: storeId },
      data: {
        rnc: data.rnc,
        companyLegalName: data.companyLegalName,
        paypalEmail: data.paypalEmail
      }
    });

    revalidatePath("/vendor/settings");
    return { success: true };
  } catch (error) {
    console.error("Error updating store settings:", error);
    return { success: false, message: "Error al actualizar." };
  }
}
