"use client";

import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { UserInfo } from "./UserInfo";

type AuthSectionProps = {
  onMenuClose?: () => void;
  onAuthClick?: (show: boolean) => void;
};

export default function AuthSection({
  onMenuClose,
  onAuthClick,
}: AuthSectionProps) {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<{
    name: string | null;
    email: string;
    image: string | null;
    role: string | null;
  } | null>(null);

  useEffect(() => {
    async function fetchUserData() {
      if (session?.user?.email) {
        const response = await fetch(`/api/user?email=${session.user.email}`);
        const data = await response.json();
        if (data.user) {
          setUserData(data.user);
        }
      }
    }

    fetchUserData();
  }, [session?.user?.email]);

  if (!session?.user?.email) {
    return (
      <motion.button
        onClick={() => onAuthClick?.(true)}
        className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-800"
        whileHover={{ scale: 1 }}
        whileTap={{ scale: 0.95 }}
      >
        Se connecter
      </motion.button>
    );
  }

  if (!userData) {
    return <div className="text-gray-600">Chargement...</div>;
  }

  return (
    <UserInfo
      user={userData}
      onMenuClose={onMenuClose}
      onAuthClick={onAuthClick}
    />
  );
}
