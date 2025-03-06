"use client";

import { TextareaHTMLAttributes } from "react";

interface Props
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
}

export default function Textarea({
  value,
  onChange,
  label,
  error,
  placeholder,
  className = "",
  rows = 3,
  ...props
}: Props) {
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
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={`
            w-full px-3 py-2 border-none outline-none
            transition-all duration-200 
            text-xs sm:text-sm
            disabled:opacity-50 disabled:cursor-not-allowed
            resize-none
            ${error ? "placeholder-red-300" : "placeholder-gray-400"}
            ${className}
          `}
          {...props}
        />
      </div>

      {error && <p className="mt-1 text-xs sm:text-sm text-red-500">{error}</p>}
    </div>
  );
}
