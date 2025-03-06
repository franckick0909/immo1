"use client";

import BorderGlowButton from "@/components/ui/borderGlowButton";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  IoCalendarOutline,
  IoListOutline,
  IoPerson,
  IoPersonOutline,
  IoSettings,
  IoShieldCheckmarkOutline,
  IoTimeOutline,
  IoTrendingUpOutline,
} from "react-icons/io5";

type User = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  createdAt: Date;
};

interface AdminDashboardProps {
  totalUsers: number;
  recentUsers: number;
  users: User[];
  stats: {
    activeUsers: number;
    onlineUsers: number;
    newUsersToday: number;
    conversionRate: string;
  };
}

export function AdminDashboard({
  totalUsers,
  users,
  stats,
}: AdminDashboardProps) {
  return (
    <div className="space-y-6">
      {/* En-tête avec navigation rapide */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Vue d&apos;ensemble de votre application
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link href="/admin/users">
            <BorderGlowButton icon={IoPerson}>
              Gérer les utilisateurs
            </BorderGlowButton>
          </Link>

          <Link href="/admin/settings">
            <BorderGlowButton icon={IoSettings} variant="dark">
              Paramètres
            </BorderGlowButton>
          </Link>
        </div>
      </div>

      {/* Cartes de statistiques avec grid auto-fit */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <IoPersonOutline className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Utilisateurs
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalUsers}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <IoShieldCheckmarkOutline className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Utilisateurs actifs
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.activeUsers}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <IoTimeOutline className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">En ligne</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.onlineUsers}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <IoCalendarOutline className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Nouveaux aujourd&apos;hui
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.newUsersToday}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <IoTrendingUpOutline className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Taux de conversion
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.conversionRate}%
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Table - Responsive */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="hidden md:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="hidden lg:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d&apos;inscription
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <motion.tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 relative">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={`Photo de ${user.name || "utilisateur"}`}
                            fill
                            sizes="(max-width: 640px) 32px, 40px"
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm sm:text-base text-gray-600">
                              {user.name?.[0]?.toUpperCase() || "?"}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm sm:text-base font-medium text-gray-900">
                          {user.name || "Sans nom"}
                        </div>
                        {/* Info mobile */}
                        <div className="md:hidden mt-1 space-y-1">
                          <div className="text-xs text-gray-500">
                            {user.email}
                          </div>
                          <div className="md:hidden mt-1 space-y-1 text-start">
                            <span
                              className={`inline-flex items-center  px-2.5 py-1 rounded-full text-xs font-medium
                      ${
                        user.role === "ADMIN"
                          ? "bg-violet-100 text-violet-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                            >
                              {user.role === "ADMIN"
                                ? "Administrateur"
                                : "Utilisateur"}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString(
                              "fr-FR",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Autres cellules - masquées sur mobile */}
                  <td className="hidden sm:table-cell px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="hidden md:table-cell px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                      ${
                        user.role === "ADMIN"
                          ? "bg-violet-100 text-violet-800"
                          : "bg-sky-100 text-sky-800"
                      }`}
                    >
                      {user.role === "ADMIN" ? "Administrateur" : "Utilisateur"}
                    </span>
                  </td>
                  <td className="hidden lg:table-cell px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 mt-6">
        <Link href="/admin/users">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-sm p-6 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <IoPersonOutline className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Gestion des utilisateurs
                </p>
              </div>
            </div>
          </motion.div>
        </Link>

        <Link href="/admin/logs">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-sm p-6 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <IoListOutline className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Historique des actions
                </p>
              </div>
            </div>
          </motion.div>
        </Link>
      </div>
    </div>
  );
}
