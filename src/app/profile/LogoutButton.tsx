"use client";

import { motion } from "framer-motion";
import { signOut } from "next-auth/react";
import { IoLogOutOutline } from "react-icons/io5";


type LogoutButtonProps = {
  className?: string;
  showIcon?: boolean;
  showText?: boolean;
};

export function LogoutButton({
  className,
  showIcon = true,
  showText = true,
}: LogoutButtonProps) {
  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <motion.button
      onClick={handleLogout}
      className={`flex items-center w-full px-4 py-2 text-red-600 rounded-lg hover:bg-red-50 transition-colors ${
        className || ""
      }`}
      whileTap={{ scale: 0.98 }}
    >
      {showIcon && <IoLogOutOutline className="mr-3 text-xl" />}
      {showText && <span>Se déconnecter</span>}
    </motion.button>
  );
}
