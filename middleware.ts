import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedPrefixes = ["/api/leads", "/api/test-integration", "/api/test-notification"];

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Akeno"'
    }
  });
}

export function middleware(request: NextRequest) {
  const password = process.env.AKENO_ACCESS_PASSWORD;
  if (!password || !protectedPrefixes.some((prefix) => request.nextUrl.pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const username = process.env.AKENO_ACCESS_USERNAME || "akeno";
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Basic ")) return unauthorized();

  try {
    const [providedUsername, providedPassword] = atob(authorization.slice(6)).split(":");
    if (providedUsername === username && providedPassword === password) {
      return NextResponse.next();
    }
  } catch {
    return unauthorized();
  }

  return unauthorized();
}

export const config = {
  matcher: [
    "/api/leads/:path*",
    "/api/test-integration/:path*",
    "/api/test-notification/:path*"
  ]
};
