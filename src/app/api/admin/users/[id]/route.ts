import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

// Schéma de validation pour les données entrantes
const updateUserSchema = z.object({
  role: z.enum(["USER", "ADMIN"]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

// Middleware de vérification d'authentification et d'autorisation
async function checkAdminAuth() {
  const session = await auth();

  if (!session?.user) {
    return {
      authorized: false,
      error: new NextResponse("Non autorisé", { status: 401 }),
    };
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email as string },
    select: { role: true, id: true },
  });

  if (!currentUser || currentUser.role !== "ADMIN") {
    return {
      authorized: false,
      error: new NextResponse("Accès refusé", { status: 403 }),
    };
  }

  return { authorized: true, currentUser };
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    // Vérifier l'authentification et l'autorisation
    const authCheck = await checkAdminAuth();
    if (!authCheck.authorized || !authCheck.currentUser) {
      return (
        authCheck.error || new NextResponse("Non autorisé", { status: 401 })
      );
    }

    // Valider l'ID utilisateur
    if (!params.id || !/^[0-9a-fA-F]{24}$/.test(params.id)) {
      return new NextResponse("ID utilisateur invalide", { status: 400 });
    }

    // Récupérer et valider les données
    const body = await request.json();
    const validationResult = updateUserSchema.safeParse(body);

    if (!validationResult.success) {
      return new NextResponse(
        `Données invalides: ${validationResult.error.message}`,
        { status: 400 }
      );
    }

    const { role, status } = validationResult.data;

    // Vérifier si on essaie de modifier un rôle
    if (role) {
      // Vérifier si on essaie de rétrograder le dernier admin
      if (role === "USER") {
        const adminCount = await prisma.user.count({
          where: { role: "ADMIN" },
        });

        if (adminCount <= 1 && authCheck.currentUser.role === "ADMIN") {
          return new NextResponse(
            "Impossible de rétrograder le dernier administrateur",
            { status: 400 }
          );
        }
      }
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: { role, status },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Journaliser l'action d'administration
    await prisma.adminLog.create({
      data: {
        action: "UPDATE",
        entity: "USER",
        entityId: params.id,
        details: {
          changes: { role, status },
        },
        adminId: authCheck.currentUser.id,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
