// Keeps the Supabase auth session fresh on every request (rotating cookies) and
// guards routes: signed-out users are sent to /login; signed-in users are kept
// off /login. Called from the root proxy (src/proxy.ts).
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Paths that must stay reachable without a session. /api/cron is hit by an
// external scheduler with a Bearer token (no auth cookie) and enforces its own
// CRON_SECRET, so the session redirect must not intercept it.
const PUBLIC_PATHS = ["/login", "/auth", "/api/cron"];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: getUser() refreshes the token when needed. Do not add logic
  // between createServerClient and getUser or you can get random logouts.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));

  // Signed out and asking for an app route -> send to /login.
  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return copyCookies(response, NextResponse.redirect(url));
  }

  // Signed in but sitting on /login -> send to the game.
  if (user && pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return copyCookies(response, NextResponse.redirect(url));
  }

  return response;
}

// Carry the refreshed auth cookies from `from` onto a redirect response, so the
// session isn't dropped when we redirect.
function copyCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((c) => to.cookies.set(c));
  return to;
}
