"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IoChevronDown } from "react-icons/io5";

interface Props<T extends string> {
  label?: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  className?: string;
  error?: string;
  disabled?: boolean;
}

export default function Select<T extends string>({
  label,
  value,
  onChange,
  options,
  className = "",
  error,
  disabled,
}: Props<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const getPosition = () => {
    if (!buttonRef.current) return { top: 0, left: 0, width: 0 };
    const rect = buttonRef.current.getBoundingClientRect();
    return {
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
    };
  };

  return (
    <div className="relative">
      {label && (
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <button
        ref={buttonRef}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          relative w-full bg-white border rounded-md px-3 py-2
          focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500
          ${error ? "border-red-500" : "border-gray-300"}
          ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
          ${className}
        `}
      >
        <div className="flex items-center justify-between">
          <span
            className={`block truncate text-xs sm:text-sm pr-2 ${
              disabled ? "text-gray-500" : ""
            }`}
          >
            {options.find((option) => option.value === value)?.label}
          </span>
          <IoChevronDown
            className={`h-4 w-4 sm:h-5 sm:w-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {isOpen &&
        mounted &&
        createPortal(
          <motion.div
            className="fixed mt-1 inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="absolute bg-white rounded-md shadow-lg border border-gray-200"
              onClick={(e) => e.stopPropagation()}
              style={{
                top: getPosition().top,
                left: getPosition().left,
                width: getPosition().width,
              }}
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              exit={{ y: -10 }}
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-gray-700 hover:text-gray-800 text-left hover:bg-gray-100 text-xs sm:text-sm ${
                    option.value === value ? "bg-indigo-50 text-indigo-600" : ""
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          </motion.div>,
          document.body
        )}

      {error && <p className="mt-1 text-xs sm:text-sm text-red-500">{error}</p>}
    </div>
  );
}
