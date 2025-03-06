import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "month";

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Calculer la date de début selon la période
    const getStartDate = () => {
      switch (period) {
        case "day":
          return today;
        case "week":
          const lastWeek = new Date(today);
          lastWeek.setDate(lastWeek.getDate() - 7);
          return lastWeek;
        case "month":
          const lastMonth = new Date(today);
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          return lastMonth;
        case "year":
          const lastYear = new Date(today);
          lastYear.setFullYear(lastYear.getFullYear() - 1);
          return lastYear;
        default:
          return today;
      }
    };

    const startDate = getStartDate();

    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      newUsersToday,
      usersByRole,
      recentActivity,
      signupsByPeriod,
      // Nouvelles requêtes
      previousPeriodUsers,
      retainedUsers,
      sessions,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: "ACTIVE" } }),
      prisma.user.count({ where: { status: "INACTIVE" } }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: today,
          },
        },
      }),
      prisma.user.groupBy({
        by: ["role"],
        _count: true,
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      }),
      // Inscriptions par période
      prisma.user.groupBy({
        by: ["createdAt"],
        where: {
          createdAt: {
            gte: startDate,
          },
        },
        _count: true,
      }),
      // Utilisateurs de la période précédente
      prisma.user.count({
        where: {
          createdAt: {
            lt: startDate,
          },
        },
      }),
      // Utilisateurs retenus
      prisma.user.count({
        where: {
          createdAt: {
            lt: startDate,
          },
          status: "ACTIVE",
        },
      }),
      // Sessions pour les heures de pointe
      prisma.session.groupBy({
        by: ["expires"],
        where: {
          expires: {
            gte: startDate,
          },
        },
        _count: true,
      }),
    ]);

    // Calculer le taux de conversion (actifs / total)
    const conversionRate =
      totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(1) : "0.0";

    // Calculer le taux de croissance
    const growthRate =
      previousPeriodUsers > 0
        ? (
            ((totalUsers - previousPeriodUsers) / previousPeriodUsers) *
            100
          ).toFixed(1)
        : "0.0";

    // Calculer le taux de rétention
    const retentionRate =
      previousPeriodUsers > 0
        ? ((retainedUsers / previousPeriodUsers) * 100).toFixed(1)
        : "0.0";

    // Formater les données d'inscription par période
    const signupsByPeriodFormatted = signupsByPeriod.map((entry) => ({
      date: new Date(entry.createdAt).toLocaleDateString("fr-FR"),
      count: entry._count,
    }));

    // Calculer les heures de pointe
    const peakHours = sessions
      .reduce((acc, session) => {
        const hour = new Date(session.expires).getHours();
        const existing = acc.find((entry) => entry.hour === hour);
        if (existing) {
          existing.count += session._count;
        } else {
          acc.push({ hour, count: session._count });
        }
        return acc;
      }, [] as Array<{ hour: number; count: number }>)
      .sort((a, b) => a.hour - b.hour);

    return NextResponse.json({
      totalUsers,
      activeUsers,
      inactiveUsers,
      newUsersToday,
      conversionRate,
      usersByRole,
      recentActivity,
      growthRate,
      retentionRate,
      signupsByPeriod: signupsByPeriodFormatted,
      peakHours,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
