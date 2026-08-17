"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function registerUser(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const role = formData.get("role") as string || "BUYER"

    if (!name || !email || !password) {
      return { error: "Todos los campos son obligatorios" }
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: "El correo ya está registrado" }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Register Error:", error)
    return { error: "Ocurrió un error en el servidor" }
  }
}
