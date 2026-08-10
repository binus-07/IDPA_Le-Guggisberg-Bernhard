import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { determineRedirect } from "@/lib/auth/route-guard";
import { fetchSessionAndRolle } from "@/lib/auth/session";

export async function proxy(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // Solange kein Supabase-Projekt verbunden ist (siehe docs/manuelle-schritte.md),
  // fehlen diese Env-Vars lokal und im Preview-Deploy. Ohne sie einfach
  // durchreichen statt jede Route mit einem 500er zu blockieren.
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // fetchSessionAndRolle() ruft u. a. getUser() auf, damit Supabase abgelaufene Sessions
  // erkennt und den Auth-Cookie bei Bedarf ueber setAll() erneuert.
  const { user, rolle } = await fetchSessionAndRolle(supabase);

  const redirectTarget = determineRedirect({
    pathname: request.nextUrl.pathname,
    hasSession: !!user,
    rolle,
  });

  if (redirectTarget) {
    const redirectResponse = NextResponse.redirect(new URL(redirectTarget, request.url));
    // Refreshed Auth-Cookies aus setAll() oben nicht verlieren, nur weil wir statt
    // "next()" jetzt "redirect()" zurueckgeben.
    supabaseResponse.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie));
    return redirectResponse;
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
