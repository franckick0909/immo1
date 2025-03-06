"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function NavLogo() {
  return (
    <motion.div
      className="flex items-center"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link href="/" className="text-xl text-gray-900">
        <span className="text-2xl font-bold">CENTURY 77</span>
      </Link>
    </motion.div>
  );
}
