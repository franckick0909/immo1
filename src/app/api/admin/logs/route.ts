import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const searchParams = new URL(request.url).searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const action = searchParams.get("action");
    const entity = searchParams.get("entity");

    const where = {
      ...(action && { action }),
      ...(entity && { entity }),
    };

    const [logs, total] = await Promise.all([
      prisma.adminLog.findMany({
        where,
        include: {
          admin: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.adminLog.count({ where }),
    ]);

    return NextResponse.json({
      logs,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    console.error("Error fetching admin logs:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await request.json();
    const { action, entity, entityId, details } = data;

    const log = await prisma.adminLog.create({
      data: {
        action,
        entity,
        entityId,
        details,
        adminId: session.user.id,
      },
      include: {
        admin: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error("Error creating admin log:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
