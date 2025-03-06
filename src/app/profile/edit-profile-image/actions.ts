"use server";

import { auth } from "@/lib/auth";
import { fileToBase64 } from "@/lib/client-utils";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateProfileImage(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Non autorisé" };
    }

    const file = formData.get("image") as File;
    if (!file) {
      return { error: "Aucune image fournie" };
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith("image/")) {
      return { error: "Le fichier doit être une image" };
    }

    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { error: "L'image ne doit pas dépasser 5MB" };
    }

    // Convertir le fichier en base64
    const base64Image = await fileToBase64(file);

    // Upload l'image vers Cloudinary
    const imageUrl = await uploadImageToCloudinary(base64Image, "profile-images");

    // Mettre à jour l'utilisateur dans la base de données
    await prisma.user.update({
      where: { email: session.user.email as string },
      data: { image: imageUrl },
    });

    revalidatePath("/profile");
    return { success: true, imageUrl };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'image:", error);
    return { error: "Une erreur est survenue lors de l'upload de l'image" };
  }
}
