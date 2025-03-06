"use server";

import { createAdminLog } from "@/lib/admin-logger";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { User } from "@prisma/client";
import { revalidatePath } from "next/cache";

type ActionResult = {
  success: boolean;
  error?: string;
  user?: User;
};

export async function deleteUser(userId: string): Promise<ActionResult> {
  try {
    const session = await auth();
    console.log("1. Vérification session");

    if (session?.user?.role !== "ADMIN") {
      return { success: false, error: "Non autorisé" };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { success: false, error: "Utilisateur non trouvé" };
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    try {
      await createAdminLog("DELETE", "USER", userId, {
        message: `Utilisateur ${user.email} supprimé`,
      });
    } catch (logError) {
      console.error(
        "Erreur non bloquante lors de la création du log:",
        logError
      );
      // Continue même si le log échoue
    }

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    return {
      success: false,
      error: "Erreur lors de la suppression de l'utilisateur",
    };
  }
}

export async function updateUserRole(
  userId: string,
  role: "USER" | "ADMIN"
): Promise<ActionResult> {
  try {
    console.log("1. Début de updateUserRole", { userId, role }); // Debug

    const session = await auth();
    console.log("2. Session:", session); // Debug

    if (!session?.user) {
      console.log("3. Pas de session"); // Debug
      return { success: false, error: "Non authentifié" };
    }

    if (session.user.role !== "ADMIN") {
      console.log("4. Utilisateur non admin:", session.user.role); // Debug
      return { success: false, error: "Non autorisé" };
    }

    console.log("5. Recherche de l'utilisateur"); // Debug
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    console.log("6. Utilisateur trouvé:", user); // Debug

    if (!user) {
      return { success: false, error: "Utilisateur non trouvé" };
    }

    console.log("7. Mise à jour du rôle"); // Debug
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    console.log("8. Utilisateur mis à jour:", updatedUser); // Debug

    try {
      await createAdminLog("UPDATE", "USER", userId, {
        previous: { role: user.role },
        new: { role },
        message: `Rôle modifié de ${user.role} à ${role}`,
      });
      console.log("9. Log admin créé"); // Debug
    } catch (logError) {
      console.error("Erreur lors de la création du log:", logError);
      // On continue même si le log échoue
    }

    revalidatePath("/admin/users");
    console.log("10. Chemin revalidé"); // Debug

    return { success: true, user: updatedUser as User };
  } catch (error) {
    console.error("Erreur détaillée dans updateUserRole:", error);
    if (error instanceof Error) {
      return {
        success: false,
        error: `Erreur: ${error.message}`,
      };
    }
    return {
      success: false,
      error: "Erreur lors de la mise à jour du rôle",
    };
  }
}

export async function updateUserStatus(
  userId: string,
  status: "ACTIVE" | "INACTIVE"
): Promise<ActionResult> {
  try {
    console.log("1. Début de updateUserStatus", { userId, status }); // Debug

    const session = await auth();
    console.log("2. Session:", session); // Debug

    if (!session?.user) {
      console.log("3. Pas de session"); // Debug
      return { success: false, error: "Non authentifié" };
    }

    if (session.user.role !== "ADMIN") {
      console.log("4. Utilisateur non admin:", session.user.role); // Debug
      return { success: false, error: "Non autorisé" };
    }

    console.log("5. Recherche de l'utilisateur"); // Debug
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        status: true,
      },
    });

    console.log("6. Utilisateur trouvé:", user); // Debug

    if (!user) {
      return { success: false, error: "Utilisateur non trouvé" };
    }

    console.log("7. Mise à jour du statut"); // Debug
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status },
      select: {
        id: true,
        email: true,
        status: true,
      },
    });

    console.log("8. Utilisateur mis à jour:", updatedUser); // Debug

    try {
      await createAdminLog("UPDATE", "USER", userId, {
        previous: { status: user.status },
        new: { status },
        message: `Statut modifié de ${user.status} à ${status}`,
      });
      console.log("9. Log admin créé"); // Debug
    } catch (logError) {
      console.error("Erreur lors de la création du log:", logError);
      // On continue même si le log échoue
    }

    revalidatePath("/admin/users");
    console.log("10. Chemin revalidé"); // Debug

    return { success: true, user: updatedUser as User };
  } catch (error) {
    console.error("Erreur détaillée dans updateUserStatus:", error);
    if (error instanceof Error) {
      return {
        success: false,
        error: `Erreur: ${error.message}`,
      };
    }
    return {
      success: false,
      error: "Erreur lors de la mise à jour du statut",
    };
  }
}
