"use client";

import { useToast } from "@/components/notifications/ToastContainer";
import BorderGlowButton from "@/components/ui/borderGlowButton";
import PasswordInput from "@/components/ui/PasswordInput";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoLockOpen } from "react-icons/io5";

export function EditPasswordForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  // Fonction pour gérer les changements dans les champs de formulaire
  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Vérifier que les mots de passe correspondent
      if (formData.newPassword !== formData.confirmPassword) {
        throw new Error("Les mots de passe ne correspondent pas");
      }

      // Vérifier que le mot de passe est assez fort
      if (formData.newPassword.length < 8) {
        throw new Error("Le mot de passe doit contenir au moins 8 caractères");
      }

      const response = await fetch("/api/user/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue");
      }

      showToast("success", "Mot de passe mis à jour avec succès");

      // Réinitialiser le formulaire
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      router.refresh();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du mot de passe:", error);
      showToast(
        "error",
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la mise à jour du mot de passe"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="p-2 h-full min-h-72">
      <h2 className="text-xl font-semibold mb-4">Mot de passe</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <label
            htmlFor="currentPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Mot de passe actuel
          </label>
          <PasswordInput
            name="currentPassword"
            label="Mot de passe actuel"
            value={formData.currentPassword}
            onChange={(value) => handleInputChange("currentPassword", value)}
            placeholder="Votre mot de passe actuel"
            className="placeholder:text-gray-400"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nouveau mot de passe
          </label>
          <PasswordInput
            name="newPassword"
            label="Nouveau mot de passe"
            value={formData.newPassword}
            onChange={(value) => handleInputChange("newPassword", value)}
            placeholder="Minimum 8 caractères"
            className="placeholder:text-gray-400"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Confirmer le mot de passe
          </label>
          <PasswordInput
            name="confirmPassword"
            label="Confirmer le mot de passe"
            value={formData.confirmPassword}
            onChange={(value) => handleInputChange("confirmPassword", value)}
            placeholder="Répétez le nouveau mot de passe"
            className="placeholder:text-gray-400"
          />
        </div>

        <div>
          <BorderGlowButton
            type="submit"
            isLoading={isSubmitting}
            disabled={
              isSubmitting ||
              !formData.currentPassword ||
              !formData.newPassword ||
              !formData.confirmPassword ||
              formData.newPassword !== formData.confirmPassword ||
              formData.newPassword.length < 8
            }
            icon={IoLockOpen}
          >
            {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
          </BorderGlowButton>
        </div>
      </form>
    </div>
  );
}
