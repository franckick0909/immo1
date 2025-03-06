"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const PasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Le mot de passe actuel est requis"),
    newPassword: z
      .string()
      .min(6, "Le nouveau mot de passe doit contenir au moins 6 caractères"),
    confirmPassword: z
      .string()
      .min(1, "La confirmation du mot de passe est requise"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export async function updatePassword(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { type: "error" as const, text: "Non autorisé" };
    }

    const validatedData = PasswordSchema.parse({
      currentPassword: formData.get("currentPassword"),
      newPassword: formData.get("newPassword"),
      confirmPassword: formData.get("confirmPassword"),
    });

    // Vérifier le mot de passe actuel
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!user) {
      return { type: "error" as const, text: "Utilisateur non trouvé" };
    }

    const isPasswordValid = await bcrypt.compare(
      validatedData.currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return { type: "error" as const, text: "Mot de passe actuel incorrect" };
    }

    // Mettre à jour le mot de passe
    const hashedPassword = await bcrypt.hash(validatedData.newPassword, 12);
    await prisma.user.update({
      where: { email: session.user.email as string },
      data: { password: hashedPassword },
    });

    revalidatePath("/profile");
    return {
      type: "success" as const,
      text: "Mot de passe mis à jour avec succès",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { type: "error" as const, text: error.errors[0].message };
    }
    return { type: "error" as const, text: "Une erreur est survenue" };
  }
}
