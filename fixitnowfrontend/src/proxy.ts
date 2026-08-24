import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";

const authRoutes = ["/auth/login", "/auth/register"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const role = session?.user?.role;

  // Protected areas
  if (path.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    if (role !== "admin") {
      return NextResponse.redirect(new URL(`/${role}`, req.url));
    }
  }

  if (path.startsWith("/customer")) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    if (role !== "customer") {
      return NextResponse.redirect(new URL(`/${role}`, req.url));
    }
  }

  if (path.startsWith("/technician")) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    if (role !== "technician") {
      return NextResponse.redirect(new URL(`/${role}`, req.url));
    }
  }

  // Don't let authenticated users go back to login/register
  if (authRoutes.includes(path) && session) {
    return NextResponse.redirect(new URL(`/${role}/dashboard`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
