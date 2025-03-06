import { auth } from "@/lib/auth";
import { getCloudinaryInstance } from "@/lib/cloudinary";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Supprimer l'image de Cloudinary si nécessaire
    try {
      const publicId = `profile_pictures/user_${session.user.email}`;
      const cloudinary = await getCloudinaryInstance();
      await cloudinary.uploader.destroy(publicId);
    } catch (cloudinaryError) {
      console.error("Erreur Cloudinary:", cloudinaryError);
      // On continue même si l'image n'existe pas dans Cloudinary
    }

    // Mettre à jour l'utilisateur dans la base de données
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { image: null },
      select: {
        name: true,
        email: true,
        image: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'image:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'image" },
      { status: 500 }
    );
  }
}
