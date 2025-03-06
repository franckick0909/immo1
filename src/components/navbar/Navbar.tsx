"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import AuthModal from "../auth/AuthModal";
import AuthSection from "./AuthSection";
import MenuButton from "./MenuButton";
import NavigationLinks from "./NavigationLinks";
import NavLogo from "./NavLogo";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const menuVariants = {
    closed: {
      opacity: 0,
      y: 50,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
        staggerDirection: -1,
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white">
        <div className="relative max-w-screen-2xl mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-between h-16">
            <NavLogo />
            <MenuButton
              isOpen={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <div className="relative sm:px-6 lg:px-8 max-w-screen-2xl mx-auto">
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/10 z-40"
                onClick={() => setIsMenuOpen(false)}
              />

              {/* Menu Content */}
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={menuVariants}
                className="absolute top-full right-0 z-50 max-w-sm w-full px-4"
              >
                <div className="grid gap-2">
                  <NavigationLinks onLinkClick={() => setIsMenuOpen(false)} />
                  <AuthSection
                    onMenuClose={() => setIsMenuOpen(false)}
                    onAuthClick={setShowAuthModal}
                  />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialView="login"
      />
    </>
  );
}
