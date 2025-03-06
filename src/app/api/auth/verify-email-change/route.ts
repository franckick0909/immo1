import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      return NextResponse.redirect(
        new URL("/auth/verification-error?error=missing-params", request.url)
      );
    }

    // Vérifier si l'utilisateur existe avec ce token et cette adresse email en attente
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        pendingEmail: email,
      },
    });

    if (!user) {
      return NextResponse.redirect(
        new URL("/auth/verification-error?error=invalid-request", request.url)
      );
    }

    // Vérifier si le token n'a pas expiré
    if (
      user.verificationExpires &&
      new Date(user.verificationExpires) < new Date()
    ) {
      return NextResponse.redirect(
        new URL("/auth/verification-error?error=expired-token", request.url)
      );
    }

    // Mettre à jour l'email de l'utilisateur
    await prisma.user.update({
      where: { id: user.id },
      data: {
        email: email,
        pendingEmail: null,
        verificationToken: null,
        verificationExpires: null,
        emailVerified: true,
      },
    });

    // Rediriger vers la page de succès
    return NextResponse.redirect(
      new URL("/auth/email-change-success", request.url)
    );
  } catch (error) {
    console.error(
      "Erreur lors de la vérification du changement d'email:",
      error
    );
    return NextResponse.redirect(
      new URL("/auth/verification-error?error=server-error", request.url)
    );
  }
}
