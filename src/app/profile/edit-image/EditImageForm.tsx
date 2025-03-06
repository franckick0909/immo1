"use client";

import { uploadImage } from "@/app/actions/upload-image";
import { useToast } from "@/components/notifications/ToastContainer";
import { fileToBase64 } from "@/lib/client-utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { FaCamera, FaTrash } from "react-icons/fa";
import BorderGlowButton from "../../../components/ui/borderGlowButton";

type User = {
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
  image?: string | null;
};

export function EditImageForm({ user }: { user: User }) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(
    user.image || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { showToast } = useToast();

  // Fonction pour gérer le clic sur le bouton d'upload
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Fonction pour gérer le changement d'image
  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Vérifier le type de fichier
      if (!file.type.startsWith("image/")) {
        showToast("error", "Le fichier doit être une image");
        setIsUploading(false);
        return;
      }

      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast("error", "L'image ne doit pas dépasser 5MB");
        setIsUploading(false);
        return;
      }

      // Afficher un aperçu de l'image
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Convertir le fichier en base64
      const base64Image = await fileToBase64(file);

      // Upload l'image vers Cloudinary via l'action serveur
      const cloudinaryImageUrl = await uploadImage(base64Image);

      // Envoyer au serveur
      const response = await fetch("/api/user/profile-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cloudinaryUrl: cloudinaryImageUrl }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de l'upload de l'image");
      }

      showToast("success", "Image de profil mise à jour avec succès");
      router.refresh();
    } catch (err) {
      console.error("Erreur:", err);
      showToast(
        "error",
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de l'upload de l'image"
      );
      setPreviewImage(user.image || null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  // Fonction pour supprimer l'image de profil
  async function handleDeleteImage() {
    if (!user.image) return;

    setIsDeleting(true);

    try {
      // Supprimer l'image du profil utilisateur via l'API
      const response = await fetch("/api/user/profile-image", {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.error || "Erreur lors de la suppression de l'image"
        );
      }

      setPreviewImage(null);
      showToast("success", "Image de profil supprimée avec succès");
      router.refresh();
    } catch (err) {
      console.error("Erreur:", err);
      showToast(
        "error",
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de la suppression de l'image"
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="p-2 h-full">
      <h2 className="text-xl font-semibold mb-4">Photo de profil</h2>

      <div className="flex flex-col items-center space-y-4">
        {/* Aperçu de l'image */}
        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
          {previewImage ? (
            <Image
              src={previewImage}
              alt="Photo de profil"
              fill
              sizes="(max-width: 768px) 100vw, 128px"
              priority
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
              <span className="text-4xl">?</span>
            </div>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="flex items-center justify-between flex-wrap gap-4 w-full">
          <BorderGlowButton
            onClick={handleUploadClick}
            disabled={isUploading || isDeleting}
            isLoading={isUploading}
            icon={FaCamera}
          >
            {isUploading ? "Chargement..." : "Modifier"}
          </BorderGlowButton>

          {previewImage && (
            <BorderGlowButton
              onClick={handleDeleteImage}
              disabled={isUploading || isDeleting}
              isLoading={isDeleting}
              variant="red"
              icon={FaTrash}
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </BorderGlowButton>
          )}
        </div>

        {/* Input de fichier caché avec label pour l'accessibilité */}
        <label htmlFor="profile-image-upload" className="sr-only">
          Télécharger une image de profil
        </label>
        <input
          id="profile-image-upload"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          title="Télécharger une image de profil"
          aria-label="Télécharger une image de profil"
        />
      </div>
    </div>
  );
}
