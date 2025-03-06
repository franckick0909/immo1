"use client";

import { LogoutButton } from "@/app/profile/LogoutButton";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaUser } from "react-icons/fa";
import { IoGridOutline } from "react-icons/io5";
import { useSession } from "next-auth/react";

type User = {
  name: string | null;
  email: string;
  image: string | null;
};

type UserInfoProps = {
  user: User;
  onMenuClose?: () => void;
  onAuthClick?: (show: boolean) => void;
};

export function UserInfo({ user, onMenuClose }: UserInfoProps) {
  const { data: session } = useSession();
  const displayName = user.name || "Utilisateur";
  const displayImage = user.image;
  const isAdmin = session?.user?.role === "ADMIN";

  const handleLinkClick = () => {
    onMenuClose?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, rotate: -10 }}
      animate={{ opacity: 1, rotate: 0 }}
      exit={{ opacity: 0, rotate: -10 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-6 rounded-lg shadow-lg overflow-hidden"
    >
      <h2 className="text-lg font-semibold mb-4 text-black">Compte</h2>
      <AnimatePresence mode="sync">
        <motion.div key="user-info" className="space-y-4">
          <motion.div className="flex items-center gap-3">
            {displayImage ? (
              <motion.div
                className="relative h-10 w-10"
                whileHover={{ scale: 1.1 }}
              >
                <Image
                  src={displayImage}
                  alt="Photo de profil"
                  fill
                  className="rounded-full object-cover"
                  sizes="40px"
                  priority={false}
                  loading="lazy"
                />
              </motion.div>
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-xl font-medium text-gray-600">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <p className="font-medium text-gray-900">{displayName}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </motion.div>

          <div className="space-y-2">
            <Link
              href="/profile"
              onClick={handleLinkClick}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center gap-4"
            >
              <FaUser />
              Mon profil
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                onClick={handleLinkClick}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center gap-4"
              >
                <IoGridOutline />
                Administration
              </Link>
            )}

            <LogoutButton
              showIcon={true}
              showText={true}
              className="px-0 py-0 text-sm"
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
