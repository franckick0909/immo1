import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const now = new Date();

    // Récupérer tous les utilisateurs avec leurs sessions
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        status: true,
        createdAt: true,
        // Utilisation de la relation correcte pour les sessions
        Session: {
          where: {
            expires: {
              gt: now,
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Ajouter l'information isOnline basée sur les sessions actives
    const usersWithOnlineStatus = users.map((user) => {
      // Vérifier si l'utilisateur a des sessions actives
      const isOnline = user.Session && user.Session.length > 0;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        status: user.status || "ACTIVE", // Valeur par défaut si status est null
        createdAt: user.createdAt,
        isOnline,
      };
    });

    return NextResponse.json(usersWithOnlineStatus);
  } catch (error) {
    console.error("Error fetching users:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await request.json();
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        status: data.status,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
