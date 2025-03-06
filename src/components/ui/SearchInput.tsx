"use client";

import { AnimatePresence, motion } from "framer-motion";
import { IoCloseCircle, IoSearch } from "react-icons/io5";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  title?: string;
  className?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Rechercher...",
  title = "Rechercher",
  className = "",
}: SearchInputProps) {
  return (
    <div className="relative">
      <IoSearch
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500
                  pointer-events-none z-10"
      />
      <div
        className="relative after:absolute after:bottom-0 after:left-0 after:h-0.5 
                      after:bg-gray-500 after:w-0 after:transition-all after:duration-300
                      focus-within:after:w-full before:absolute before:bottom-0 before:left-0 
                      before:w-full before:h-[1px] before:bg-gray-300"
      >
        <input
          type="text"
          title={title}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`pl-10 pr-10 w-full h-11 border-none outline-none
                    transition-all duration-200 ${className}`}
        />
      </div>
      <AnimatePresence>
        {value && (
          <motion.div
            className="absolute right-0 top-0 bottom-0 w-10 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onChange("")}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
              title="Effacer la recherche"
            >
              <IoCloseCircle className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
