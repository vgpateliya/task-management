import { NextRequest, NextResponse } from "next/server";
import { apiAuthRoutes, publicRoutes } from "./utils/constants";

function getToken(request: NextRequest): string | null {
  return (
    request.cookies.get("token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "") ||
    null
  );
}

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.includes(pathname) || apiAuthRoutes.includes(pathname);
}

function handleUnauthenticated(
  pathname: string,
  request: NextRequest
): NextResponse {
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL("/login", request.url));
}

function handleAuthenticated(
  pathname: string,
  request: NextRequest
): NextResponse {
  if (publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = getToken(request);

  return token
    ? handleAuthenticated(pathname, request)
    : handleUnauthenticated(pathname, request);
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/api/:path*", "/login", "/register"],
};
