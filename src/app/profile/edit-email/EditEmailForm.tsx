"use client";

import { useToast } from "@/components/notifications/ToastContainer";
import BorderGlowButton from "@/components/ui/borderGlowButton";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoMail } from "react-icons/io5";

export function EditEmailForm({
  user,
}: {
  user: { id: string; email: string };
}) {
  const router = useRouter();
  const [email, setEmail] = useState(user.email || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [emailUpdateRequested, setEmailUpdateRequested] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const { showToast } = useToast();

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setEmailUpdateRequested(false);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Vérifier que l'email est valide
    if (!email || !email.includes("@")) {
      showToast("error", "Veuillez entrer une adresse email valide");
      return;
    }

    // Vérifier que l'email est différent de l'email actuel
    if (email === user.email) {
      showToast(
        "error",
        "La nouvelle adresse email doit être différente de l'actuelle"
      );
      return;
    }

    // Afficher la modal de confirmation
    setNewEmail(email);
    setShowConfirmModal(true);
  }

  async function confirmEmailChange() {
    setIsSubmitting(true);
    setShowConfirmModal(false);

    try {
      const response = await fetch("/api/user/email", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: newEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue");
      }

      setEmailUpdateRequested(true);
      showToast(
        "success",
        "Un email de vérification a été envoyé à votre nouvelle adresse email. Veuillez cliquer sur le lien dans cet email pour confirmer le changement."
      );
      router.refresh();
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'email:", error);
      showToast(
        "error",
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la mise à jour de l'email"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="p-2 h-full">
      <h2 className="text-xl font-semibold mb-4">Adresse email</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Adresse email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="votre@email.com"
        />

        <div className="pt-14">
          <BorderGlowButton
            type="submit"
            isLoading={isSubmitting}
            disabled={
              isSubmitting || !email.includes("@") || email === user.email
            }
            icon={IoMail}
          >
            {isSubmitting ? "Envoi en cours..." : "Mettre à jour"}
          </BorderGlowButton>

          {emailUpdateRequested && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-amber-600 mb-2">
                Un email de vérification a été envoyé à votre nouvelle adresse
                email. Veuillez cliquer sur le lien dans cet email pour
                confirmer le changement.
              </p>
              <p className="text-sm text-amber-500">
                Votre adresse email ne sera pas modifiée tant que vous n&apos;aurez
                pas confirmé le changement.
              </p>
            </div>
          )}
        </div>
      </form>

      {/* Modal de confirmation */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirmation du changement d'email"
        size="md"
      >
        <div className="space-y-4">
          <p>
            Vous êtes sur le point de changer votre adresse email de{" "}
            <span className="font-semibold">{user.email}</span> à{" "}
            <span className="font-semibold">{newEmail}</span>.
          </p>
          <p className="text-amber-600">
            Un email de vérification sera envoyé à votre nouvelle adresse email.
            Vous devrez cliquer sur le lien dans cet email pour confirmer le
            changement.
          </p>
          <div className="flex space-x-3 pt-4">
            <BorderGlowButton
              onClick={() => setShowConfirmModal(false)}
              variant="light"
              className="flex-1"
            >
              Annuler
            </BorderGlowButton>
            <BorderGlowButton
              onClick={confirmEmailChange}
              variant="red"
              className="flex-1"
              isLoading={isSubmitting}
            >
              Confirmer
            </BorderGlowButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
