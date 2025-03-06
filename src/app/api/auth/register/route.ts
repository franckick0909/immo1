import {
  createVerificationEmail,
  generateVerificationToken,
  sendEmail,
} from "@/lib/email";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 400 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Générer un token de vérification
    const verificationToken = generateVerificationToken();

    // Définir la date d'expiration (24 heures)
    const verificationExpires = new Date();
    verificationExpires.setHours(verificationExpires.getHours() + 24);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "USER", // rôle par défaut
        verificationToken,
        verificationExpires,
        emailVerified: false,
      },
    });

    // Envoyer l'email de vérification
    const emailOptions = createVerificationEmail(email, verificationToken);
    await sendEmail(emailOptions);

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        message: "Un email de vérification a été envoyé à votre adresse email.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'inscription" },
      { status: 500 }
    );
  }
}
