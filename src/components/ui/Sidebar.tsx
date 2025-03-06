"use client";

import { motion } from "framer-motion";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import { IoLogOutOutline } from "react-icons/io5";
import { MenuToggle } from "./MenuToggle";

interface SidebarItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  title: string;
  subtitle: string;
  items: SidebarItem[];
  className?: string;
}

export function Sidebar({
  isOpen,
  setIsOpen,
  title,
  subtitle,
  items,
  className = "",
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Utiliser useCallback pour éviter les recréations inutiles de la fonction
  const handleLogout = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      try {
        await signOut({ redirect: false });
        router.push("/auth/login");
      } catch (error) {
        console.error("Erreur lors de la déconnexion:", error);
      }
    },
    [router]
  );

  return (
    <motion.aside
      initial={false}
      animate={{
        width: isOpen ? "320px" : "64px",
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 30,
        },
      }}
      className={`fixed bg-white shadow-lg z-40 ${className}`}
    >
      <div className="flex flex-col h-full">
        {/* Header avec titre et burger button */}
        <div className="flex items-center justify-between p-4 border-b">
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="overflow-hidden"
            >
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="text-sm text-gray-600">{subtitle}</p>
            </motion.div>
          )}
          <MenuToggle
            isOpen={isOpen}
            toggle={() => setIsOpen(!isOpen)}
            className={isOpen ? "" : ""}
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 p-2 rounded-lg transition-colors
                ${pathname === item.href ? "bg-gray-100" : "hover:bg-gray-50"}
              `}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg">
                {item.icon}
              </div>

              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    transition: { delay: 0.1 },
                  }}
                  className="flex flex-col min-w-0"
                >
                  <span className="text-sm font-medium truncate">
                    {item.label}
                  </span>
                  <span className="text-xs text-gray-500 truncate">
                    {item.description}
                  </span>
                </motion.div>
              )}
            </Link>
          ))}
        </nav>

        {/* Bouton de déconnexion */}
        <div className="p-3 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-gray-50 text-left"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg">
              <IoLogOutOutline className="text-xl text-gray-600" />
            </div>

            {isOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: { delay: 0.1 },
                }}
                className="flex flex-col min-w-0"
              >
                <span className="text-sm font-medium truncate">
                  Se déconnecter
                </span>
                <span className="text-xs text-gray-500 truncate">
                  Quitter votre session
                </span>
              </motion.div>
            )}
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
