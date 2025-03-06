"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

interface PasswordInputProps {
  name: string;
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export default function PasswordInput({
  name,
  label,
  value = "",
  onChange,
  placeholder = "",
  required = true,
  className = "",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="relative">
      <div
        className="relative after:absolute after:bottom-0 after:left-0 after:h-0.5 
                    after:bg-gray-500 after:w-0 after:transition-all after:duration-300
                    focus-within:after:w-full before:absolute before:bottom-0 before:left-0 
                    before:w-full before:h-[1px] before:bg-gray-300"
      >
        <input
          title={label}
          type={showPassword ? "text" : "password"}
          name={name}
          id={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          className={`pl-3 pr-10 w-full h-11 border-none outline-none
                   transition-all duration-200 ${className}`}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            title={
              showPassword
                ? "Masquer le mot de passe"
                : "Afficher le mot de passe"
            }
          >
            {showPassword ? (
              <IoEyeOffOutline className="w-5 h-5" />
            ) : (
              <IoEyeOutline className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
