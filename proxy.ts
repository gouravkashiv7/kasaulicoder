import { type NextRequest, NextResponse } from "next/server";

// Blocks cross-site requests that change data (CSRF). The auth cookie is
// sent with same-site requests only (SameSite=Lax), and this rejects
// cross-site POST/PUT/PATCH/DELETE to the API even in browsers that don't
// default to Lax.
export function proxy(request: NextRequest) {
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) return;

  const fetchSite = request.headers.get("sec-fetch-site");
  let crossSite = fetchSite === "cross-site";

  // Older browsers without Sec-Fetch-Site: compare Origin with the host
  if (!fetchSite) {
    const origin = request.headers.get("origin");
    const host =
      request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    if (origin && host) {
      try {
        crossSite = new URL(origin).host !== host;
      } catch {
        crossSite = true;
      }
    }
  }

  if (crossSite) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}

export const config = {
  matcher: "/api/:path*",
};
