import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard"];

function decodeJWT(token: string) {
  try {
    const base64Payload = token.split(".")[1];
    // Decode base64 URL-safe variant
    const payload = atob(base64Payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const decoded = decodeJWT(token);
    if (!decoded) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (pathname === "/dashboard") {
      const defaultPath =
        decoded.userType === "replacement"
          ? "/dashboard/replacement/feed"
          : decoded.userType === "employer"
          ? "/dashboard/employer/feed"
          : decoded.userType === "admin"
          ? "/dashboard/admin/users"
          : `/dashboard/${decoded.userType}`;

      return NextResponse.redirect(new URL(defaultPath, request.url));
    }

    if (pathname.startsWith("/dashboard/")) {
      const dashboardSegment = pathname.split("/")[2];

      if (decoded.userType === "replacement") {
        if (dashboardSegment !== "replacement") {
          return NextResponse.redirect(
            new URL("/dashboard/replacement/feed", request.url)
          );
        }

        const replacementSubsegment = pathname.split("/")[3];
        const allowedReplacementSubRoutes = ["feed", "missions", "profile"];

        if (
          replacementSubsegment &&
          !allowedReplacementSubRoutes.includes(replacementSubsegment)
        ) {
          return NextResponse.redirect(
            new URL("/dashboard/replacement/feed", request.url)
          );
        }
      } else if (decoded.userType === "employer") {
        if (dashboardSegment !== "employer") {
          return NextResponse.redirect(
            new URL("/dashboard/employer/feed", request.url)
          );
        }

        const employerSubsegment = pathname.split("/")[3];
        const allowedEmployerSubRoutes = [
          "feed",
          "missions",
          "doctors",
          "applications",
          "profile",
          "documents",
        ];

        if (
          employerSubsegment &&
          !allowedEmployerSubRoutes.includes(employerSubsegment)
        ) {
          return NextResponse.redirect(
            new URL("/dashboard/employer/feed", request.url)
          );
        }
      } else if (decoded.userType === "admin") {
        if (dashboardSegment !== "admin") {
          return NextResponse.redirect(
            new URL("/dashboard/admin/users", request.url)
          );
        }

        const adminSubsegment = pathname.split("/")[3];
        const allowedAdminSubRoutes = [
          "users",
          "missions",
          "documents",
          "analytics",
        ];

        if (
          adminSubsegment &&
          !allowedAdminSubRoutes.includes(adminSubsegment)
        ) {
          return NextResponse.redirect(
            new URL("/dashboard/admin/users", request.url)
          );
        }
      } else if (dashboardSegment && dashboardSegment !== decoded.userType) {
        return NextResponse.redirect(
          new URL(`/dashboard/${decoded.userType}`, request.url)
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
