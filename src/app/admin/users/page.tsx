import { prisma } from "@/lib/db";
import { UsersClient } from "./users-client";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      image: true,
    },
  });

  return <UsersClient users={users} />;
}
