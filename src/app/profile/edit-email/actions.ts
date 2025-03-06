"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const EmailSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export async function updateEmail(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { type: "error" as const, text: "Non autorisé" };
    }

    const validatedData = EmailSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    // Vérifier si l'email existe déjà
    if (validatedData.email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });
      if (existingUser) {
        return { type: "error" as const, text: "Cet email est déjà utilisé" };
      }
    }

    // Vérifier le mot de passe
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!user) {
      return { type: "error" as const, text: "Utilisateur non trouvé" };
    }

    const isPasswordValid = await bcrypt.compare(
      validatedData.password,
      user.password
    );

    if (!isPasswordValid) {
      return { type: "error" as const, text: "Mot de passe incorrect" };
    }

    await prisma.user.update({
      where: { email: session.user.email as string },
      data: { email: validatedData.email },
    });


    revalidatePath("/profile");
    return { type: "success" as const, text: "Email mis à jour avec succès" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { type: "error" as const, text: error.errors[0].message };
    }
    return { type: "error" as const, text: "Une erreur est survenue" };
  }
}
