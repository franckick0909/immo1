"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateUserName(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { error: "Non autorisé" };
    }

    const newName = formData.get("name") as string;

    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        name: newName,
      },
      select: {
        name: true,
        email: true,
        image: true,
      },
    });

    // Revalider tous les chemins qui affichent le nom de l'utilisateur
    revalidatePath("/profile");
    revalidatePath("/");

    return {
      success: true,
      user: updatedUser,
    };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du nom:", error);
    return { error: "Une erreur est survenue lors de la mise à jour" };
  }
}
