import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const data = await request.json();
    const { password } = data;

    // Vérifier le mot de passe avant la suppression
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { password: true },
    });

    const isValid = await bcrypt.compare(password, user?.password || "");
    if (!isValid) {
      return NextResponse.json(
        { error: "Mot de passe incorrect" },
        { status: 400 }
      );
    }

    // Supprimer l'utilisateur
    await prisma.user.delete({
      where: { email: session.user.email },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression du compte:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
