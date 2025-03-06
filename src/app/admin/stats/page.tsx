"use client";

import Select from "@/components/ui/Select";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Period = "day" | "week" | "month" | "year";

type StatsData = {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsersToday: number;
  conversionRate: string;
  usersByRole: Array<{
    role: string;
    _count: number;
  }>;
  recentActivity: Array<{
    id: string;
    name: string | null;
    email: string;
    createdAt: string;
  }>;
  growthRate: number;
  retentionRate: number;
  signupsByPeriod: Array<{
    date: string;
    count: number;
  }>;
  peakHours: Array<{
    hour: number;
    count: number;
  }>;
};

export default function StatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<Period>("month");

  const fetchStats = async (selectedPeriod: Period) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/stats?period=${selectedPeriod}`);
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des statistiques");
      }
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(period);
  }, [period]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );

  if (error) return <div className="text-red-500">Erreur: {error}</div>;
  if (!stats) return <div>Aucune statistique disponible</div>;

  const COLORS = ["#8884d8", "#FFBB28", "#CC0000", "#00C49F"];

  const periodOptions = [
    { value: "day", label: "Aujourd'hui" },
    { value: "week", label: "Cette semaine" },
    { value: "month", label: "Ce mois" },
    { value: "year", label: "Cette année" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <div className="flex gap-4">
          <Select
            options={periodOptions}
            value={period}
            onChange={(value) => setPeriod(value as Period)}
            title="Sélectionner la période"
            className="w-48"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total utilisateurs", value: stats.totalUsers },
          { title: "Utilisateurs actifs", value: stats.activeUsers },
          { title: "Taux de conversion", value: `${stats.conversionRate}%` },
          { title: "Taux de rétention", value: `${stats.retentionRate}%` },
        ].map((card) => (
          <motion.div
            key={card.title}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {card.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">
            Évolution des inscriptions
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.signupsByPeriod}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Répartition des rôles</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.usersByRole}
                  dataKey="_count"
                  nameKey="role"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {stats.usersByRole.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Heures de pointe</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.peakHours}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Activité récente</h3>
          <div className="space-y-4">
            {stats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  {activity.name?.[0] || activity.email[0]}
                </div>
                <div>
                  <p className="font-medium">{activity.name || "Sans nom"}</p>
                  <p className="text-sm text-gray-500">{activity.email}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(activity.createdAt).toLocaleString("fr-FR")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
