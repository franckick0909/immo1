import { motion } from "framer-motion";
import { useState } from "react";
import FormField from "./FormField";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fonction pour gérer les changements dans les champs de formulaire
  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    // Réinitialiser les messages d'erreur et de succès lors de la modification des champs
    setError(null);
    setSuccess(null);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    // Validation des champs
    if (!formData.name.trim()) {
      setError("Le nom est requis");
      setLoading(false);
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Veuillez entrer une adresse email valide");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue");
      }

      // Afficher un message de succès
      setSuccess(
        "Votre compte a été créé avec succès ! Un email de vérification a été envoyé à votre adresse email. Veuillez vérifier votre boîte de réception et cliquer sur le lien pour activer votre compte."
      );

      // Réinitialiser le formulaire
      setFormData({
        name: "",
        email: "",
        password: "",
      });

      // Ne pas rediriger automatiquement, attendre que l'utilisateur vérifie son email
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Une erreur est survenue");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-100 text-red-600 rounded-md text-sm"
        >
          {error}
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-green-100 text-green-600 rounded-md text-sm"
        >
          {success}
        </motion.div>
      )}

      <FormField
        label="Nom"
        type="text"
        name="name"
        value={formData.name}
        onChange={(value) => handleInputChange("name", value)}
        placeholder="Votre nom"
        index={0}
      />

      <FormField
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={(value) => handleInputChange("email", value)}
        placeholder="votre@email.com"
        index={1}
      />

      <FormField
        label="Mot de passe"
        type="password"
        name="password"
        value={formData.password}
        onChange={(value) => handleInputChange("password", value)}
        placeholder="Minimum 8 caractères"
        index={2}
      />

      <motion.button
        type="submit"
        disabled={loading || !!success}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        {loading ? "Inscription..." : "S'inscrire"}
      </motion.button>
    </form>
  );
}
