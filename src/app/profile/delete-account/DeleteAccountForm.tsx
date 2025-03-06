"use client";

import BorderGlowButton from "@/components/ui/borderGlowButton";
import Input from "@/components/ui/Input";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { IoTrash } from "react-icons/io5";

export function DeleteAccountForm() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Effet pour effacer automatiquement les messages après 3 secondes
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);

      // Nettoyage du timer si le composant est démonté ou si message change
      return () => clearTimeout(timer);
    }
  }, [message]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
        body: JSON.stringify({ password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.error) {
        setMessage({ type: "error", text: data.error });
        return;
      }

      // Déconnexion et redirection vers la page d'accueil
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Erreur lors de la suppression du compte:", error);
      setMessage({ type: "error", text: "Une erreur est survenue" });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div
          className={`p-4 rounded-md transition-opacity duration-300 text-sm inline-block ${
            message.type === "success"
              ? "bg-green-50 text-green-600"
              : "bg-red-50 text-red-600"
          }`}
        >
          {message.text}
        </div>
      )}

      <Input
        label="Confirmez votre mot de passe pour supprimer votre compte"
        type="password"
        value={password}
        onChange={setPassword}
      />

      <div className="flex">
        <BorderGlowButton type="submit" variant="red" icon={IoTrash}>
          Supprimer mon compte
        </BorderGlowButton>
      </div>
    </form>
  );
}
