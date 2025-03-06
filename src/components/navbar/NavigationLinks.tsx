"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { FiCircle } from "react-icons/fi";
import SimpleAnimatedLink from "../ui/simpleAnimatedLink";

type NavigationItem = {
  name: string;
  href: string;
};

const navigation: NavigationItem[] = [
  { name: "Accueil", href: "/" },
  { name: "À propos", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Contact", href: "/contact" },
];

type NavigationLinksProps = {
  onLinkClick: () => void;
};

export default function NavigationLinks({ onLinkClick }: NavigationLinksProps) {
  const pathname = usePathname();

  const containerVariants = {
    hidden: {
      opacity: 0,
      transition: {
        duration: 0.3,
        when: "afterChildren", // Attend que les enfants aient terminé
      },
    },
    show: {
      opacity: 1,
      transition: {
        duration: 0.3,
        when: "beforeChildren", // Anime avant les enfants
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
        when: "afterChildren", // Attend que les enfants aient terminé
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.2 },
    },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2 },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      variants={{
        closed: {
          opacity: 0,
          y: 20,
          rotate: 10,
          transition: {
            duration: 0.3,
            when: "afterChildren",
          },
        },
        open: {
          opacity: 1,
          y: 0,
          rotate: 0,  
          transition: {
            duration: 0.3,
            when: "beforeChildren",
          },
        },
      }}
      className="bg-white p-6 rounded-lg  w-full"
    >
      <h2 className="text-lg font-semibold mb-4 text-black">Navigation</h2>
      <AnimatePresence mode="wait">
        <motion.div
          key="nav-links"
          variants={containerVariants}
          initial="hidden"
          animate="show"
          exit="exit"
          className="space-y-4"
        >
          {navigation.map((item, index) => (
            <motion.div
              key={item.name}
              variants={itemVariants}
              custom={index}
              className="overflow-hidden flex items-center justify-between"
            >
              <SimpleAnimatedLink
                href={item.href}
                text={item.name}
                className="text-gray-700 hover:text-gray-800"
                onClick={onLinkClick}
              />
              {pathname === item.href && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <FiCircle className="h-2 w-2 fill-current text-gray-900 mb-1" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
