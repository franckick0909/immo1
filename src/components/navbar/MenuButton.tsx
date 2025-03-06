"use client";

import { motion } from "framer-motion";

type MenuButtonProps = {
  isOpen: boolean;
  onClick: () => void;
};

export default function MenuButton({ isOpen, onClick }: MenuButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`inline-flex items-center justify-center text-gray-900 rounded-full transition-colors duration-300 z-50 ${
        isOpen ? "bg-gray-300" : "bg-gray-50"
      }`}
      initial={false}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      <span className="sr-only">Ouvrir le menu</span>
      <motion.div
        className="relative flex items-center gap-2 px-4 py-3 rounded-full"
        initial={false}
        animate={{
          opacity: 1,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        <span className="text-sm font-medium" title={isOpen ? "Fermer le menu" : "Ouvrir le menu"}>
          {isOpen ? "FERMER" : "MENU"}
        </span>
        <div className="relative flex items-center justify-center w-4 h-4">
          {/* Premier point */}
          <motion.span
            className="absolute w-1 h-1 bg-black rounded-full"
            initial={false}
            animate={{
              x: isOpen ? 0 : -2,
              y: isOpen ? -3 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          />
          {/* Deuxième point */}
          <motion.span
            className="absolute w-1 h-1 bg-black rounded-full"
            initial={false}
            animate={{
              x: isOpen ? 0 : 6,
              y: isOpen ? 4 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          />
        </div>
      </motion.div>
    </motion.button>
  );
}
