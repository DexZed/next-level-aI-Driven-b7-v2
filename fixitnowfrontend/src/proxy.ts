import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";

const authRoutes = ["/auth/login", "/auth/register"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const searchParams = req.nextUrl.search;
  const fullUrl = path + searchParams;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const role = session?.user?.role;
  const status = (session?.user as any)?.status;

  if (session && status === "banned") {
    return NextResponse.redirect(new URL("/auth/login?error=banned", req.url));
  }

  // Helper to redirect to login while keeping the last visited page
  const redirectToLogin = () => {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", fullUrl);
    return NextResponse.redirect(loginUrl);
  };

  // Protected areas
  if (path.startsWith("/admin")) {
    if (!session) return redirectToLogin();
    if (role !== "admin") {
      return NextResponse.redirect(new URL(`/${role}/dashboard`, req.url));
    }
  }

  if (path.startsWith("/customer")) {
    if (!session) return redirectToLogin();
    if (role !== "customer") {
      return NextResponse.redirect(new URL(`/${role}/dashboard`, req.url));
    }
  }

  if (path.startsWith("/technician")) {
    if (!session) return redirectToLogin();
    if (role !== "technician") {
      return NextResponse.redirect(new URL(`/${role}/dashboard`, req.url));
    }
  }

  // Don't let authenticated users go back to login/register
  if (authRoutes.includes(path) && session && role) {
    return NextResponse.redirect(new URL(`/${role}/dashboard`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
