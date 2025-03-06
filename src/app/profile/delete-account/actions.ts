"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";

const DeleteAccountSchema = z.object({
  password: z.string().min(1, "Le mot de passe est requis"),
});

export async function deleteAccount(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { type: "error" as const, text: "Non autorisé" };
    }

    const validatedData = DeleteAccountSchema.parse({
      password: formData.get("password"),
    });

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

    // Supprimer toutes les données associées
    await prisma.$transaction([
      // Supprimer les sessions
      prisma.session.deleteMany({
        where: { userId: user.id },
      }),
      // Supprimer les comptes liés (OAuth)
      prisma.account.deleteMany({
        where: { userId: user.id },
      }),
      // Supprimer l'utilisateur
      prisma.user.delete({
        where: { id: user.id },
      }),
    ]);

    // Rediriger vers la page d'accueil
    redirect("/");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { type: "error" as const, text: error.errors[0].message };
    }
    return { type: "error" as const, text: "Une erreur est survenue" };
  }
}
