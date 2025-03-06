"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import {
  IoCheckmarkCircle,
  IoCloseCircle,
  IoInformationCircle,
  IoWarning,
} from "react-icons/io5";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

export function Toast({
  id,
  type,
  message,
  duration = 5000,
  onClose,
}: ToastProps) {
  // Fermer automatiquement le toast après la durée spécifiée
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  // Définir les couleurs et icônes en fonction du type
  const getToastStyles = () => {
    switch (type) {
      case "success":
        return {
          bgColor: "bg-green-50",
          borderColor: "border-green-500",
          textColor: "text-green-700",
          icon: <IoCheckmarkCircle className="w-5 h-5 text-green-500" />,
        };
      case "error":
        return {
          bgColor: "bg-red-50",
          borderColor: "border-red-500",
          textColor: "text-red-700",
          icon: <IoCloseCircle className="w-5 h-5 text-red-500" />,
        };
      case "warning":
        return {
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-500",
          textColor: "text-yellow-700",
          icon: <IoWarning className="w-5 h-5 text-yellow-500" />,
        };
      case "info":
      default:
        return {
          bgColor: "bg-blue-50",
          borderColor: "border-blue-500",
          textColor: "text-blue-700",
          icon: <IoInformationCircle className="w-5 h-5 text-blue-500" />,
        };
    }
  };

  const styles = getToastStyles();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`${styles.bgColor} ${styles.textColor} border-l-4 ${styles.borderColor} p-4 rounded-md shadow-lg mb-2 max-w-md w-full flex items-start`}
    >
      <div className="flex-shrink-0 mr-3 mt-0.5">{styles.icon}</div>
      <div className="flex-grow">
        <p className="font-medium">{message}</p>
      </div>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Fermer"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </motion.div>
  );
}
