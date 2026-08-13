// Next.js 16 renamed the `middleware` file convention to `proxy`. This runs on
// every request (except static assets) to refresh the Supabase session and
// guard routes. See src/lib/supabase/middleware.ts for the logic.
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Run on all routes except static assets and images.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
