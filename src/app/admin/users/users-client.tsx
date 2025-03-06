"use client";

import {
  deleteUser,
  updateUserRole,
  updateUserStatus,
} from "@/app/admin/actions";
import BorderGlowButton from "@/components/ui/borderGlowButton";
import Modal from "@/components/ui/Modal";
import SearchInput from "@/components/ui/SearchInput";
import Select from "@/components/ui/Select";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoTrash } from "react-icons/io5";

type User = {
  id: string;
  name: string | null;
  email: string;
  role: "USER" | "ADMIN";
  status: "ACTIVE" | "INACTIVE";
  createdAt: Date;
  image: string | null;
};

type Filters = {
  role: "" | "USER" | "ADMIN";
  status: "" | "ACTIVE" | "INACTIVE";
};

export function UsersClient({ users }: { users: User[] }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Filters>({
    role: "",
    status: "",
  });
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.role) {
      filtered = filtered.filter((user) => user.role === filters.role);
    }

    if (filters.status) {
      filtered = filtered.filter((user) => user.status === filters.status);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, filters, users]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      setIsDeleting(true);
      const result = await deleteUser(userToDelete.id);

      if (!result.success) {
        setMessage({
          type: "error",
          text: result.error || "Une erreur est survenue",
        });
        return;
      }

      setFilteredUsers((prev) =>
        prev.filter((user) => user.id !== userToDelete.id)
      );
      setMessage({ type: "success", text: "Utilisateur supprimé avec succès" });

      setUserToDelete(null);
      router.refresh();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      setMessage({
        type: "error",
        text: "Erreur lors de la suppression de l'utilisateur",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRoleChange = async (
    userId: string,
    newRole: "USER" | "ADMIN"
  ) => {
    try {
      setIsLoading(userId);
      console.log("Début mise à jour rôle:", { userId, newRole });

      const result = await updateUserRole(userId, newRole);
      console.log("Résultat:", result);

      if (!result.success) {
        console.log("Échec:", result.error);
        setMessage({
          type: "error",
          text: result.error || "Une erreur est survenue",
        });
        return;
      }

      setFilteredUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );

      setMessage({ type: "success", text: "Rôle mis à jour avec succès" });

      setTimeout(() => {
        router.refresh();
      }, 500);
    } catch (error) {
      console.error("Erreur complète:", error);
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Erreur lors de la mise à jour du rôle",
      });
    } finally {
      setIsLoading(null);
    }
  };

  const handleStatusChange = async (
    userId: string,
    newStatus: "ACTIVE" | "INACTIVE"
  ) => {
    try {
      setIsLoading(userId);

      const result = await updateUserStatus(userId, newStatus);

      if (!result.success) {
        setMessage({
          type: "error",
          text: result.error || "Une erreur est survenue",
        });
        return;
      }

      setFilteredUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );

      setMessage({ type: "success", text: "Statut mis à jour avec succès" });

      setTimeout(() => {
        router.refresh();
      }, 500);
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Erreur lors de la mise à jour du statut",
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Utilisateurs</h1>
      </div>

      {message && (
        <div
          className={`p-4 rounded-md ${
            message.type === "success"
              ? "bg-green-50 text-green-600"
              : "bg-red-50 text-red-600"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="w-full md:w-1/3">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Rechercher un utilisateur..."
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-2/3">
          <Select
            value={filters.role}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                role: value as Filters["role"],
              }))
            }
            options={[
              { value: "", label: "Tous les rôles" },
              { value: "USER", label: "Utilisateurs" },
              { value: "ADMIN", label: "Administrateurs" },
            ]}
          />
          <Select
            value={filters.status}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                status: value as Filters["status"],
              }))
            }
            options={[
              { value: "", label: "Tous les statuts" },
              { value: "ACTIVE", label: "Actifs" },
              { value: "INACTIVE", label: "Inactifs" },
            ]}
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Utilisateur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rôle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date de création
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
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
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Select
                    value={user.role}
                    onChange={(value) =>
                      handleRoleChange(user.id, value as "USER" | "ADMIN")
                    }
                    options={[
                      { value: "USER", label: "Utilisateur" },
                      { value: "ADMIN", label: "Administrateur" },
                    ]}
                    disabled={isLoading === user.id}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Select
                    value={user.status}
                    onChange={(value) =>
                      handleStatusChange(
                        user.id,
                        value as "ACTIVE" | "INACTIVE"
                      )
                    }
                    options={[
                      { value: "ACTIVE", label: "Actif" },
                      { value: "INACTIVE", label: "Inactif" },
                    ]}
                    disabled={isLoading === user.id}
                  />
                </td>
                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 sm:px-6 py-4 text-right">
                  {/* Bouton mobile (icon seulement) */}
                  <div className="md:hidden">
                    <BorderGlowButton
                      variant="red"
                      icon={IoTrash}
                      onClick={() => handleDeleteClick(user)}
                      className="!px-2"
                    >
                      {""}
                    </BorderGlowButton>
                  </div>

                  {/* Bouton desktop (icon + texte) */}
                  <div className="hidden md:block">
                    <BorderGlowButton
                      variant="red"
                      icon={IoTrash}
                      onClick={() => handleDeleteClick(user)}
                    >
                      Supprimer
                    </BorderGlowButton>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de confirmation */}
      <Modal
        isOpen={!!userToDelete}
        onClose={() => !isDeleting && setUserToDelete(null)}
        title="Confirmer la suppression"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Êtes-vous sûr de vouloir supprimer l&apos;utilisateur{" "}
            <span className="font-medium text-gray-900">
              {userToDelete?.name || userToDelete?.email}
            </span>
            ?
          </p>
          <p className="text-sm text-gray-500">
            Cette action est irréversible.
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <BorderGlowButton
              variant="light"
              onClick={() => setUserToDelete(null)}
              disabled={isDeleting}
            >
              Annuler
            </BorderGlowButton>
            <BorderGlowButton
              variant="red"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              isLoading={isDeleting}
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </BorderGlowButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
