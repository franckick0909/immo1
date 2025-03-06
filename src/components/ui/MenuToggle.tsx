"use client";

import { ThemeColor, getColorClass } from "@/config/theme";
import { motion } from "framer-motion";

interface MenuToggleProps {
  isOpen: boolean;
  toggle: () => void;
  className?: string;
  ariaLabel?: string;
  color?: ThemeColor;
  size?: "sm" | "md" | "lg";
}

export function MenuToggle({
  isOpen,
  toggle,
  className = "",
  ariaLabel = "Menu principal",
  color = "gray",
  size = "md",
}: MenuToggleProps) {
  // Définir les tailles en fonction de l'option size
  const sizeConfig = {
    sm: {
      button: "w-8 h-8",
      bar: "w-4",
    },
    md: {
      button: "w-10 h-10",
      bar: "w-5",
    },
    lg: {
      button: "w-12 h-12",
      bar: "w-6",
    },
  };

  // Utiliser les classes de couleur du thème
  const bgColorClass = getColorClass(color, "bg", 50);
  const hoverColorClass = getColorClass(color, "bg", 100);
  const barColorClass = getColorClass(color, "bg", 600);
  const ringColorClass = getColorClass(color, "ring", 400);

  return (
    <button
      title="Menu"
      type="button"
      onClick={toggle}
      aria-label={ariaLabel}
      className={`relative focus:outline-none focus:ring-2 ${ringColorClass} focus:ring-offset-2 rounded-full ${className}`}
    >
      <div
        className={`relative ${bgColorClass} hover:${hoverColorClass} rounded-full flex items-center justify-center ${sizeConfig[size].button} transition-colors duration-200`}
      >
        <motion.span
          className={`absolute h-0.5 ${sizeConfig[size].bar} ${barColorClass}`}
          animate={{
            rotate: isOpen ? 45 : 0,
            translateY: isOpen ? 1 : -4,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
        <motion.span
          className={`absolute h-0.5 ${sizeConfig[size].bar} ${barColorClass}`}
          animate={{
            opacity: isOpen ? 0 : 1,
            translateY: 1,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
        <motion.span
          className={`absolute h-0.5 ${sizeConfig[size].bar} ${barColorClass}`}
          animate={{
            rotate: isOpen ? -45 : 0,
            translateY: isOpen ? 1 : 6,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      </div>
    </button>
  );
}
