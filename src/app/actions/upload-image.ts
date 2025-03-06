"use server";

import { uploadImageToCloudinary } from "@/lib/cloudinary";

/**
 * Action serveur pour uploader une image vers Cloudinary
 * @param base64Image L'image en base64 à uploader
 * @returns L'URL de l'image uploadée
 */
export async function uploadImage(base64Image: string): Promise<string> {
  try {
    return await uploadImageToCloudinary(base64Image, "profile-images");
  } catch (error) {
    console.error("Erreur lors de l'upload de l'image:", error);
    throw new Error("Échec de l'upload de l'image");
  }
}
