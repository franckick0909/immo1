import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  createEmailChangeVerification,
  generateVerificationToken,
  sendEmail,
} from "@/lib/email";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const data = await request.json();
    const newEmail = data.email;

    // Vérifier si l'email est déjà utilisé
    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Cette adresse email est déjà utilisée" },
        { status: 400 }
      );
    }

    // Générer un token de vérification
    const verificationToken = generateVerificationToken();

    // Définir la date d'expiration (24 heures)
    const verificationExpires = new Date();
    verificationExpires.setHours(verificationExpires.getHours() + 24);

    // Mettre à jour l'utilisateur avec l'email en attente
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        pendingEmail: newEmail,
        verificationToken,
        verificationExpires,
      },
      select: {
        name: true,
        email: true,
        image: true,
      },
    });

    // Envoyer l'email de vérification
    const emailOptions = createEmailChangeVerification(
      newEmail,
      verificationToken
    );
    await sendEmail(emailOptions);

    return NextResponse.json({
      user: updatedUser,
      message:
        "Un email de vérification a été envoyé à votre nouvelle adresse email.",
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'email:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
