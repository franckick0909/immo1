import { auth } from "@/lib/auth";
import { getCloudinaryInstance } from "@/lib/cloudinary";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Aucune image fournie" },
        { status: 400 }
      );
    }

    // Convertir le fichier en base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Obtenir l'instance de Cloudinary et uploader l'image
    const cloudinary = await getCloudinaryInstance();

    // Upload vers Cloudinary
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: "profile_pictures",
      public_id: `user_${session.user.email}`,
      overwrite: true,
    });

    // Mettre à jour l'URL de l'image dans la base de données
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { image: result.secure_url },
      select: {
        name: true,
        email: true,
        image: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Erreur lors de l'upload de l'image:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'upload de l'image" },
      { status: 500 }
    );
  }
}
