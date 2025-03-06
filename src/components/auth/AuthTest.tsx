"use client";

import { signIn, useSession } from "next-auth/react";
import { useState } from "react";

export default function AuthTest() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  const createTestUser = async () => {
    setLoading(true);
    try {
      // Créer un utilisateur de test
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
          name: "Utilisateur Test",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Se connecter avec l'utilisateur créé
        await signIn("credentials", {
          email: "test@example.com",
          password: "password123",
          redirect: false,
        });
      } else {
        console.error("Erreur:", data.error);
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg text-black">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          État de l&apos;authentification :
        </h2>
        <button
          type="button"
          onClick={createTestUser}
          disabled={loading}

          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Création..." : "Créer utilisateur test"}
        </button>
      </div>
      <pre className="bg-white p-4 rounded overflow-auto">
        {JSON.stringify({ status, session }, null, 2)}
      </pre>
    </div>
  );
}
