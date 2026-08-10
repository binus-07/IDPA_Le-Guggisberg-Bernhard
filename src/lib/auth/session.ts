import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Rolle } from "@/lib/auth/route-guard";

/**
 * Liest Session + Rolle ueber einen fertig konstruierten Supabase-Client aus. Bewusst als
 * eigene Funktion, weil src/proxy.ts (Cookie-Zugriff ueber request.cookies) und
 * src/lib/auth/server-guard.ts (Cookie-Zugriff ueber next/headers) ihre Clients unterschiedlich
 * aufbauen muessen, die Abfrage selbst aber identisch ist.
 */
export async function fetchSessionAndRolle(
  supabase: SupabaseClient,
): Promise<{ user: User | null; rolle: Rolle | null }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let rolle: Rolle | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("rolle")
      .eq("id", user.id)
      .single();
    rolle = (profile?.rolle as Rolle | null | undefined) ?? null;
  }

  return { user, rolle };
}
