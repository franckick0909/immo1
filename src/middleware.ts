import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // Ajout de logs pour le débogage
  console.log("Middleware called for path:", request.nextUrl.pathname);

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  console.log("Token in middleware:", token);

  // Protection des routes admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    console.log("Checking admin access...");

    if (!token) {
      console.log("Access denied: No token");
      return NextResponse.redirect(new URL("/", request.url));
    }

    console.log("User role:", token.role);

    if (token.role !== "ADMIN") {
      console.log("Access denied: Not admin");
      return NextResponse.redirect(new URL("/", request.url));
    }

    console.log("Admin access granted");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*"],
};
