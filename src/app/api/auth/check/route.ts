import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    return NextResponse.json({ user: session?.user || null });
  } catch (error) {
    console.error("Erreur lors de la vérification de l'authentification:", error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
