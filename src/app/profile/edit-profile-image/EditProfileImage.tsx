"use client";

import { useUser } from "@/contexts/UserContext";
import { motion } from "framer-motion";
import { useState } from "react";
import { updateProfileImage } from "./actions";
import Image from "next/image";

export function EditProfileImage() {
  const { user, updateUser } = useUser();
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const result = await updateProfileImage(formData);
      if (result.success) {
        await updateUser({ image: result.imageUrl });
        setMessage({ type: "success", text: "Photo de profil mise à jour" });
      } else {
        setMessage({
          type: "error",
          text: result.error || "Une erreur est survenue",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'image:", error);
      setMessage({ type: "error", text: "Une erreur est survenue" });
    } finally {
      setIsUploading(false);
    }

  };

  return (
    <div className="max-w-md space-y-4 bg-blue-500 shadow rounded-lg p-6">
      <div className="flex items-center space-x-4">
        {user?.image ? (
          <Image
            src={user.image}
            alt="Photo de profil"
            width={80}
            height={80}
            className="rounded-full object-cover"
            priority
          />
        ) : (
          <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-2xl font-medium text-gray-600">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <label className="relative cursor-pointer">
          <motion.span
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800"
          >
            {isUploading ? "Chargement..." : "Changer la photo"}
          </motion.span>

          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isUploading}
          />
        </label>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-md ${
            message.type === "success"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {message.text}
        </motion.div>
      )}
    </div>
  );
}
