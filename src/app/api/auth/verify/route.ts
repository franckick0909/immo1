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

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.redirect(
        new URL("/auth/verification-error?error=user-not-found", request.url)
      );
    }

    // Vérifier si le token est valide
    if (user.verificationToken !== token) {
      return NextResponse.redirect(
        new URL("/auth/verification-error?error=invalid-token", request.url)
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

    // Mettre à jour l'utilisateur
    await prisma.user.update({
      where: { email },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationExpires: null,
      },
    });

    // Rediriger vers la page de succès
    return NextResponse.redirect(
      new URL("/auth/verification-success", request.url)
    );
  } catch (error) {
    console.error("Erreur lors de la vérification de l'email:", error);
    return NextResponse.redirect(
      new URL("/auth/verification-error?error=server-error", request.url)
    );
  }
}
