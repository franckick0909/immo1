"use client";

import BorderGlowButton from "@/components/ui/borderGlowButton";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { motion } from "framer-motion";
import { useState } from "react";
import { IoCheckmark, IoSave } from "react-icons/io5";

type SettingSection = {
  id: string;
  title: string;
  description: string;
};

const sections: SettingSection[] = [
  {
    id: "general",
    title: "Général",
    description: "Paramètres généraux de l'application",
  },
  {
    id: "security",
    title: "Sécurité",
    description: "Configuration de la sécurité",
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Gestion des notifications",
  },
  {
    id: "api",
    title: "API",
    description: "Paramètres de l'API",
  },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("general");
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    appName: "Mon Application",
    siteUrl: "https://example.com",
    description: "Description de l'application...",
    maintenance: false,
    sessionDuration: "30",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
          <p className="mt-1 text-sm text-gray-500">Configuration du système</p>
        </div>
        <BorderGlowButton onClick={handleSave} variant="light">
          {saved ? (
            <>
              <IoCheckmark className="mr-2" />
              Enregistré
            </>
          ) : (
            <>
              <IoSave className="mr-2" />
              Enregistrer
            </>
          )}
        </BorderGlowButton>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Barre latérale des sections */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-64 flex-shrink-0"
        >
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                type="button"
                title={section.title}
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  activeSection === section.id
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-900 hover:bg-gray-50"
                }`}
              >
                {section.title}
              </button>
            ))}
          </nav>
        </motion.div>

        {/* Contenu principal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 bg-white rounded-lg shadow-sm p-6"
        >
          {activeSection === "general" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Paramètres généraux
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Configurez les paramètres de base de votre application.
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Nom de l'application"
                  value={formData.appName}
                  onChange={(value) =>
                    setFormData({ ...formData, appName: value })
                  }
                />

                <Input
                  label="URL du site"
                  type="url"
                  value={formData.siteUrl}
                  onChange={(value) =>
                    setFormData({ ...formData, siteUrl: value })
                  }
                />

                <Textarea
                  label="Description"
                  value={formData.description}
                  onChange={(value) =>
                    setFormData({ ...formData, description: value })
                  }
                  placeholder="Décrivez votre application..."
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mode maintenance
                  </label>
                  <div className="mt-1">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.maintenance}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            maintenance: e.target.checked,
                          })
                        }
                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        Activer le mode maintenance
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "security" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Sécurité</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Configurez les paramètres de sécurité.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Authentification à deux facteurs
                  </label>
                  <div className="mt-1">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        Activer pour tous les utilisateurs
                      </span>
                    </label>
                  </div>
                </div>

                <Input
                  label="Durée de session (minutes)"
                  type="number"
                  value={formData.sessionDuration}
                  onChange={(value) =>
                    setFormData({ ...formData, sessionDuration: value })
                  }
                />
              </div>
            </div>
          )}

          {/* Ajoutez d'autres sections ici */}
        </motion.div>
      </div>

      {/* Notification de sauvegarde */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: saved ? 1 : 0, y: saved ? 0 : 50 }}
        className="fixed bottom-4 right-4"
      >
        <div className="bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
          Paramètres enregistrés avec succès
        </div>
      </motion.div>
    </div>
  );
}
