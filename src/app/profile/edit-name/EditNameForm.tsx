"use client";

import { updateUserName } from "@/app/api/user/actions";
import { useToast } from "@/components/notifications/ToastContainer";
import BorderGlowButton from "@/components/ui/borderGlowButton";
import Input from "@/components/ui/Input";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoSave } from "react-icons/io5";

export function EditNameForm({
  user,
}: {
  user: { id: string; name: string | null };
}) {
  const router = useRouter();
  const { update: updateSession } = useSession();
  const [name, setName] = useState(user.name || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", name);

      const response = await updateUserName(formData);

      if (response.error) {
        throw new Error(response.error);
      }

      // Mettre à jour la session pour refléter le nouveau nom
      await updateSession({ name });

      showToast("success", "Nom mis à jour avec succès");
      router.refresh();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du nom:", error);
      showToast(
        "error",
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la mise à jour du nom"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="p-2 h-full">
      <h2 className="text-xl font-semibold mb-4">Nom d&apos;utilisateur</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nom d'utilisateur"
          value={name}
          onChange={setName}
          placeholder="Votre nom"
        />

        <div className="pt-14">
          <BorderGlowButton
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting || !name.trim()}
            icon={IoSave}
          >
            {isSubmitting ? "Enregistrement..." : "Enregistrer"}
          </BorderGlowButton>
        </div>
      </form>
    </div>
  );
}
