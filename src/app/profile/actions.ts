"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ProfileFormState } from "./types";

// Schéma de validation
const ProfileSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  currentPassword: z.string().optional(),
  newPassword: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères")
    .optional(),
});

export async function updateProfile(
  formData: FormData
): Promise<ProfileFormState> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Non autorisé" };
    }

    // Validation des données
    const validatedData = ProfileSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      currentPassword: formData.get("currentPassword"),
      newPassword: formData.get("newPassword"),
    });

    // Vérifier si l'email existe déjà
    if (validatedData.email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });
      if (existingUser) {
        return { error: "Cet email est déjà utilisé" };
      }
    }

    // Préparer les données à mettre à jour
    const updateData: {
      name: string;
      email: string;
      password?: string;
    } = {
      name: validatedData.name,
      email: validatedData.email,
    };


    // Si un nouveau mot de passe est fourni
    if (validatedData.newPassword && validatedData.currentPassword) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email as string },
      });

      if (!user) {
        return { error: "Utilisateur non trouvé" };
      }

      const isPasswordValid = await bcrypt.compare(
        validatedData.currentPassword,
        user.password
      );

      if (!isPasswordValid) {
        return { error: "Mot de passe actuel incorrect" };
      }

      updateData.password = await bcrypt.hash(validatedData.newPassword, 12);
    }

    // Mettre à jour l'utilisateur
    await prisma.user.update({
      where: { email: session.user.email as string },
      data: updateData,
    });

    // Revalider la page pour afficher les nouvelles données
    revalidatePath("/profile");
    return { success: "Profil mis à jour avec succès" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: "Une erreur est survenue" };
  }
}
