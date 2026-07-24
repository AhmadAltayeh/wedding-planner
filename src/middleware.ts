import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const password = process.env.APP_PASSWORD;
  const sessionToken = process.env.SESSION_TOKEN;

  if (!password || !sessionToken) {
    return NextResponse.next();
  }

  const session = request.cookies.get(SESSION_COOKIE)?.value;
  if (session === sessionToken) {
    return NextResponse.next();
  }

  const login = new URL("/login", request.url);
  if (pathname !== "/") {
    login.searchParams.set("from", pathname);
  }
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
