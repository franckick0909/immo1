"use client";

import BorderGlowButton from "@/components/ui/borderGlowButton";
import SearchInput from "@/components/ui/SearchInput";
import Select from "@/components/ui/Select";
import { EntityData } from "@/lib/admin-logger";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { IoRefresh } from "react-icons/io5";

interface AdminLog {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  details: {
    previous?: EntityData;
    new?: EntityData;
    message?: string;
  };
  createdAt: string;
  admin: {
    name: string | null;
    email: string;
  };
}

interface PaginationInfo {
  total: number;
  pages: number;
  currentPage: number;
}

const actionOptions = [
  { value: "", label: "Toutes les actions" },
  { value: "CREATE", label: "Création" },
  { value: "UPDATE", label: "Modification" },
  { value: "DELETE", label: "Suppression" },
  { value: "LOGIN", label: "Connexion" },
  { value: "STATUS_CHANGE", label: "Changement de statut" },
  { value: "ROLE_CHANGE", label: "Changement de rôle" },
];

const entityOptions = [
  { value: "", label: "Toutes les entités" },
  { value: "USER", label: "Utilisateur" },
  { value: "PROPERTY", label: "Propriété" },
  { value: "SETTINGS", label: "Paramètres" },
];

export default function LogsPage() {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    action: "",
    entity: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        ...(filters.action && { action: filters.action }),
        ...(filters.entity && { entity: filters.entity }),
      });

      const response = await fetch(`/api/admin/logs?${params}`);
      if (!response.ok) throw new Error("Failed to fetch logs");

      const data = await response.json();
      setLogs(data.logs);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleFilterChange = (type: "action" | "entity", value: string) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
    setCurrentPage(1); // Réinitialiser la page lors du changement de filtre
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* En-tête responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Logs d&apos;administration
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Historique des actions administratives
          </p>
        </div>
        <BorderGlowButton onClick={fetchLogs} variant="light">
          <IoRefresh className="mr-2" />
          Actualiser
        </BorderGlowButton>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <>
          {/* Filtres responsives */}
          <div className="bg-white p-4 rounded-lg shadow-sm space-y-4 print:hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Action
                </label>
                <Select
                  options={actionOptions}
                  value={filters.action}
                  onChange={(value) => handleFilterChange("action", value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Entité
                </label>
                <Select
                  options={entityOptions}
                  value={filters.entity}
                  onChange={(value) => handleFilterChange("entity", value)}
                  className="w-full"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recherche
              </label>
              <SearchInput
                value={searchTerm}
                onChange={(value) => {
                  setSearchTerm(value);
                  setCurrentPage(1);
                }}
                placeholder="Rechercher dans les logs..."
              />
            </div>
          </div>

          {/* Table des logs */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden print:shadow-none">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 print:bg-transparent">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Admin
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entité
                    </th>
                    <th className="hidden md:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Détails
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log) => (
                    <motion.tr
                      key={log.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-500">
                        {new Date(log.createdAt).toLocaleString("fr-FR")}
                      </td>
                      <td className="hidden sm:table-cell px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {log.admin.name || "Sans nom"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {log.admin.email}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            log.action === "CREATE"
                              ? "bg-emerald-100 text-emerald-800"
                              : log.action === "UPDATE"
                              ? "bg-sky-100 text-sky-800"
                              : log.action === "DELETE"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-violet-100 text-violet-800"
                          } print:bg-transparent print:p-0`}
                        >
                          {log.action}
                        </span>
                        {/* Info mobile */}
                        <div className="sm:hidden mt-1 space-y-1 flex flex-col">
                          <div className="text-xs text-gray-500">
                            {log.admin.name || "Sans nom"} ({log.admin.email})
                          </div>
                          <div className="text-xs text-gray-500">
                            {log.entity}
                          </div>
                          <div className="text-xs text-gray-500  h-full truncate">
                            {JSON.stringify(log.details)}
                          </div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-4 sm:px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate">
                        {log.entity}
                      </td>
                      <td className="hidden md:table-cell px-4 sm:px-6 py-4 text-sm text-gray-500">
                        <pre className="whitespace-pre-wrap font-sans">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination responsive */}
          {pagination && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6 print:hidden">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-700 w-full sm:w-auto text-center sm:text-left">
                  <p>
                    Affichage de{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * 50 + 1}
                    </span>{" "}
                    à{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * 50, pagination.total)}
                    </span>{" "}
                    sur <span className="font-medium">{pagination.total}</span>{" "}
                    résultats
                  </p>
                </div>

                {/* Pagination mobile */}
                <div className="">
                <span className="text-sm text-gray-700">
                    Page {currentPage} sur {pagination.pages}
                  </span>
                </div>
                <div className="flex justify-between w-full sm:hidden">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Précédent
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.min(pagination.pages, page + 1)
                      )
                    }
                    disabled={currentPage === pagination.pages}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Suivant
                  </button>
                </div>

                {/* Pagination desktop */}
                <div className="hidden sm:flex gap-1">
                  {Array.from({ length: pagination.pages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === i + 1
                          ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
