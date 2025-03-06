import { auth } from "@/lib/auth";
import { deleteImageFromCloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Gérer l'upload d'image de profil
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Récupérer les données JSON
    const { cloudinaryUrl } = await request.json();

    if (!cloudinaryUrl) {
      return NextResponse.json(
        { error: "URL d'image non fournie" },
        { status: 400 }
      );
    }

    // Mettre à jour l'utilisateur dans la base de données
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email as string },
      data: { image: cloudinaryUrl },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      imageUrl: cloudinaryUrl,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'image:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

// Gérer la suppression d'image de profil
export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Récupérer l'utilisateur pour obtenir l'URL de l'image actuelle
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      select: { image: true },
    });

    if (user?.image && user.image.includes("cloudinary")) {
      // Supprimer l'image de Cloudinary
      await deleteImageFromCloudinary(user.image);
    }

    // Mettre à jour l'utilisateur dans la base de données
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email as string },
      data: { image: null },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'image:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
