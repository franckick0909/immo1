import { AnimatePresence, motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Modal from "../ui/Modal";
import FormField from "./FormField";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialView?: "login" | "register";
};

export default function AuthModal({
  isOpen,
  onClose,
  initialView = "login",
}: AuthModalProps) {
  const router = useRouter();
  const [view, setView] = useState<"login" | "register">(initialView);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Réinitialiser le formulaire lors du changement de vue
  const switchView = () => {
    setView(view === "login" ? "register" : "login");
    setError(null);
    setFormData({
      name: "",
      email: "",
      password: "",
    });
  };

  // Fonction pour gérer les changements dans les champs de formulaire
  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validation des champs
    if (view === "register" && !formData.name.trim()) {
      setError("Le nom est requis");
      setIsLoading(false);
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Veuillez entrer une adresse email valide");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      setIsLoading(false);
      return;
    }

    try {
      if (view === "register") {
        // Inscription
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Erreur lors de l'inscription");
        }
      }

      // Connexion (après inscription ou directement)
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("Email ou mot de passe incorrect");
      }

      router.refresh();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={view === "login" ? "Connexion" : "Inscription"}
    >
      <AnimatePresence mode="wait">
        <motion.form
          key={view}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: view === "login" ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: view === "login" ? 20 : -20 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-100 text-red-600 rounded-md text-sm"
            >
              {error}
            </motion.div>
          )}

          {view === "register" && (
            <FormField
              label="Nom"
              type="text"
              name="name"
              value={formData.name}
              onChange={(value) => handleInputChange("name", value)}
              placeholder="Votre nom"
              index={0}
            />
          )}

          <FormField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={(value) => handleInputChange("email", value)}
            placeholder="votre@email.com"
            index={view === "register" ? 1 : 0}
          />

          <FormField
            label="Mot de passe"
            type="password"
            name="password"
            value={formData.password}
            onChange={(value) => handleInputChange("password", value)}
            placeholder={
              view === "register"
                ? "Minimum 6 caractères"
                : "Votre mot de passe"
            }
            index={view === "register" ? 2 : 1}
          />

          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md
                     shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-800
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors duration-200"
            whileHover={{ scale: 1 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
            ) : view === "login" ? (
              "Se connecter"
            ) : (
              "S'inscrire"
            )}
          </motion.button>

          <div className="text-center mt-4">
            <motion.button
              type="button"
              onClick={switchView}
              className="text-sm text-gray-600 hover:text-gray-800"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.95 }}
            >
              {view === "login"
                ? "Pas encore de compte ? S'inscrire"
                : "Déjà un compte ? Se connecter"}
            </motion.button>
          </div>
        </motion.form>
      </AnimatePresence>
    </Modal>
  );
}
