"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChangeEvent, InputHTMLAttributes } from "react";
import { IoCloseCircle } from "react-icons/io5";

interface Props
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  showClearButton?: boolean;
}

export default function Input({
  value,
  onChange,
  label,
  error,
  placeholder,
  showClearButton = true,
  className = "",
  type = "text",
  ...props
}: Props) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative">
      {label && (
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div
        className={`
          relative after:absolute after:bottom-0 after:left-0 after:h-0.5 
          after:bg-gray-500 after:w-0 after:transition-all after:duration-300
          focus-within:after:w-full before:absolute before:bottom-0 
          before:left-0 before:w-full before:h-[1px] 
          ${error ? "before:bg-red-500 after:bg-red-500" : "before:bg-gray-300"}
        `}
      >
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className={`
            w-full h-11 border-none outline-none pr-10
            transition-all duration-200 
            text-xs sm:text-sm
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? "placeholder-red-300" : "placeholder-gray-400"}
            ${className}
          `}
          {...props}
        />
      </div>

      <AnimatePresence>
        {showClearButton && value && (
          <motion.div
            className="absolute right-0 top-0 bottom-0 w-10 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onChange("")}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
              title="Effacer"
            >
              <IoCloseCircle className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="mt-1 text-xs sm:text-sm text-red-500">{error}</p>}
    </div>
  );
}
