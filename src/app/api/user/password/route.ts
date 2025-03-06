import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const data = await request.json();
    const { currentPassword, newPassword } = data;

    // Vérifier l'ancien mot de passe
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { password: true },
    });

    const isValid = await bcrypt.compare(currentPassword, user?.password || "");
    if (!isValid) {
      return NextResponse.json(
        { error: "Mot de passe actuel incorrect" },
        { status: 400 }
      );
    }

    // Hasher et mettre à jour le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { email: session.user.email },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du mot de passe:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
