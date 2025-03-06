"use client";

import { AnimatePresence } from "framer-motion";
import { createContext, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Toast, ToastType } from "./Toast";

// Définir le type pour un toast
export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

// Définir le contexte pour les toasts
interface ToastContextType {
  showToast: (type: ToastType, message: string, duration?: number) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte des toasts
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error(
      "useToast doit être utilisé à l'intérieur d'un ToastProvider"
    );
  }
  return context;
}

// Composant Provider pour les toasts
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Fonction pour ajouter un toast
  const showToast = (type: ToastType, message: string, duration = 5000) => {
    const id = uuidv4();
    setToasts((prev) => [...prev, { id, type, message, duration }]);
  };

  // Fonction pour supprimer un toast
  const hideToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              id={toast.id}
              type={toast.type}
              message={toast.message}
              duration={toast.duration}
              onClose={hideToast}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
