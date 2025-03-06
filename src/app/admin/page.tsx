import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { AdminDashboard } from "./AdminDashboard";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      role: true,
    },
  });

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  const [
    totalUsers,
    activeUsers,
    onlineUsers,
    newUsersToday,
    adminCount,
    regularUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: {
        NOT: {
          status: "INACTIVE",
        },
      },
    }),
    prisma.user.count({
      where: {
        Session: {
          some: {
            expires: {
              gt: new Date(),
            },
          },
        },
      },
    }),
    prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
    prisma.user.count({
      where: { role: "ADMIN" },
    }),
    prisma.user.count({
      where: { role: "USER" },
    }),
  ]);

  const recentUsers = await prisma.user.count({
    where: {
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    },
  });

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
    },
  });

  const stats = {
    activeUsers,
    onlineUsers,
    newUsersToday,
    adminCount,
    regularUsers,
    conversionRate:
      totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(1) : "0",
  };

  return (
    <AdminDashboard
      totalUsers={totalUsers}
      recentUsers={recentUsers}
      users={users}
      stats={stats}
    />
  );
}
