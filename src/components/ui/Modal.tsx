"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  closeOnEsc?: boolean;
  closeOnOutsideClick?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  closeOnEsc = true,
  closeOnOutsideClick = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Gestion de la touche Echap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && closeOnEsc) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Empêcher le défilement du body quand la modale est ouverte
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      // Restaurer le défilement quand la modale est fermée
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose, closeOnEsc]);

  // Focus sur la modale quand elle s'ouvre
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  // Taille de la modale
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnOutsideClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="flex min-h-screen items-center justify-center p-4"
            onClick={handleBackdropClick}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm"
              aria-hidden="true"
            />

            <motion.div
              ref={modalRef}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              className={`relative w-full ${sizeClasses[size]} transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl focus:outline-none`}
              tabIndex={-1}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  id="modal-title"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {title}
                </h3>
                <button
                  type="button"
                  aria-label="Fermer"
                  onClick={onClose}
                  className="rounded-full p-1 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  <IoClose className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-2">{children}</div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
