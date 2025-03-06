"use client";

import { motion } from "framer-motion";
import {
  ButtonHTMLAttributes,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { IconType } from "react-icons";

interface BorderGlowButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
  icon?: IconType;
  variant?: "light" | "dark" | "red";
}

const BorderGlowButton = ({
  children,
  type = "button",
  isLoading = false,
  icon: Icon,
  variant = "light",
  className = "",
  disabled,
  ...props
}: BorderGlowButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [mousePosition, setMousePosition] = useState({
    x: "-100%",
    y: "-100%",
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x: `${x}px`, y: `${y}px` });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const styles = {
    light: {
      button: "bg-gray-200",
      content: "bg-white/90 text-gray-800",
      glow: "bg-[radial-gradient(theme(colors.gray.400)_0%,transparent_70%)]",
    },
    dark: {
      button: "bg-gray-700",
      content: "bg-black/70 text-white",
      glow: "bg-[radial-gradient(theme(colors.gray.300)_0%,transparent_70%)]",
    },
    red: {
      button: "bg-red-50",
      content: "bg-white/90 text-red-600",
      glow: "bg-[radial-gradient(theme(colors.red.400)_0%,transparent_70%)]",
    },
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={isLoading || disabled}
      className={`
        relative overflow-hidden rounded-lg
        transform transition-transform ease-in-out active:scale-90
        disabled:opacity-50 disabled:cursor-not-allowed
        ${styles[variant].button}
        ${className}
      `}
      {...props}
    >
      <motion.span
        className={`absolute z-0 h-28 w-28 -translate-x-1/2 -translate-y-1/2 ${styles[variant].glow}`}
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
        }}
      />
      <div
        className={`
          relative z-10 m-[1px] rounded-md 
          ${styles[variant].content}
          px-4 py-2 text-sm backdrop-blur-sm
        `}
      >
        <span className="flex items-center justify-center gap-2">
          {isLoading ? (
            <motion.div
              className={`w-5 h-5 border-2 border-t-transparent rounded-full ${
                variant === "dark"
                  ? "border-white"
                  : variant === "red"
                  ? "border-red-600"
                  : "border-gray-800"
              }`}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            <>
              {Icon && <Icon className="h-5 w-5" />}
              {children}
            </>
          )}
        </span>
      </div>
    </button>
  );
};

export default BorderGlowButton;
