"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";

interface AnimatedLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  underlineColor?: string;
  underlineHeight?: string;
  duration?: number;
  textColorHover?: string;
  variant?: "slide" | "expand" | "fade" | "split";
}

export default function AnimatedLink({
  href,
  children,
  className = "",
  underlineColor = "bg-white",
  underlineHeight = "h-[1px]",
  duration = 0.5,
  textColorHover = "hover:text-white",
  variant = "slide",
}: AnimatedLinkProps) {
  const variants = {
    slide: {
      before: `before:content-[''] before:absolute before:w-full ${underlineHeight} before:bottom-0 before:left-0 
              before:${underlineColor} before:origin-right before:scale-x-0 hover:before:origin-left hover:before:scale-x-100
              before:transition-transform before:duration-${duration}00 before:ease-in-out`,
      after: "",
    },
    expand: {
      before: `before:content-[''] before:absolute before:w-0 ${underlineHeight} before:bottom-0 before:left-1/2 
              before:${underlineColor} hover:before:w-full hover:before:left-0
              before:transition-all before:duration-${duration}00 before:ease-in-out`,
      after: "",
    },
    fade: {
      before: `before:content-[''] before:absolute before:w-full ${underlineHeight} before:bottom-0 before:left-0 
              before:${underlineColor} before:opacity-0 hover:before:opacity-100
              before:transition-opacity before:duration-${duration}00 before:ease-in-out`,
      after: "",
    },
    split: {
      before: `before:content-[''] before:absolute before:w-0 ${underlineHeight} before:bottom-0 before:left-0 
              before:${underlineColor} hover:before:w-1/2
              before:transition-all before:duration-${duration}00 before:ease-in-out`,
      after: `after:content-[''] after:absolute after:w-0 ${underlineHeight} after:bottom-0 after:right-0 
             after:${underlineColor} hover:after:w-1/2
             after:transition-all after:duration-${duration}00 after:ease-in-out`,
    },
  };

  return (
    <Link
      href={href}
      className={`relative inline-block ${textColorHover} ${variants[variant].before} ${variants[variant].after} ${className}`}
    >
      <motion.span
        initial={{ opacity: 0.9 }}
        whileHover={{ opacity: 1, y: -1 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
    </Link>
  );
}
