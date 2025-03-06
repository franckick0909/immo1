"use client";

import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

interface SimpleAnimatedLinkProps {
  href: string;
  text: string;
  className?: string;
  onClick?: () => void;
}

export default function SimpleAnimatedLink({ href, text, className, onClick }: SimpleAnimatedLinkProps) {
  return (
    <div className="relative overflow-visible group inline-block">
      <Link
        href={href}
        onClick={onClick}
        className={`relative z-10 flex items-end font-light tracking-tight uppercase ${className}`}
      >
        <span className="relative overflow-hidden inline-flex items-center perspective-1000">
          <span className="relative inline-block transition-transform duration-700 ease-in-out group-hover:-translate-y-full group-hover:skew-y-3 py-1 px-1">
            {text}
          </span>
          <span className="absolute top-full left-0 inline-block whitespace-nowrap tracking-normal">
            {text.split('').map((letter, i) => (
              <motion.span 
                key={i} 
                className="relative inline-block transition-transform duration-700 ease-in-out group-hover:-translate-y-full group-hover:skew-y-3 text-gray-800 font-normal py-1"
                style={{ transitionDelay: `${i * 20}ms` }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </motion.span>
            ))}
          </span>
        </span>
      </Link>
    </div>
  );
}