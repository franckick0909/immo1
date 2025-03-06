"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { IoAlertCircle } from "react-icons/io5";

export default function VerificationErrorPage() {
  const searchParams = useSearchParams();
  const errorType = searchParams.get("error") || "unknown";

  const errorMessages = {
    "missing-params": "Paramètres manquants dans la requête de vérification.",
    "user-not-found": "Utilisateur non trouvé.",
    "invalid-token": "Le token de vérification est invalide.",
    "expired-token": "Le token de vérification a expiré.",
    "invalid-request": "Requête de vérification invalide.",
    "server-error": "Une erreur serveur est survenue lors de la vérification.",
    unknown: "Une erreur inconnue est survenue lors de la vérification.",
  };

  const errorMessage = errorMessages[errorType as keyof typeof errorMessages];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <IoAlertCircle className="h-16 w-16 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Erreur de vérification
          </h1>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <div className="space-y-3">
            <Link
              href="/auth/login"
              className="block px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Retour à la connexion
            </Link>
            <Link
              href="/auth/register"
              className="block px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Créer un nouveau compte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
