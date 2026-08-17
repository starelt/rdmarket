"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"

export async function updateUserCredentials(userId: string, newEmail: string, newPassword?: string) {
  try {
    const updateData: any = {
      email: newEmail,
    };

    if (newPassword && newPassword.trim() !== "") {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateData.password = hashedPassword;
    }

    await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    revalidatePath("/admin/users");
    
    return { success: true, message: "Credenciales actualizadas exitosamente." };
  } catch (error) {
    console.error("Error updating credentials:", error);
    return { success: false, message: "Error al actualizar credenciales." };
  }
}
