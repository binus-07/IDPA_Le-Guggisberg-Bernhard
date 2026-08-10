import { redirect } from "next/navigation";
import { determineRedirect } from "@/lib/auth/route-guard";
import { fetchSessionAndRolle } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

/**
 * Server-seitige Wiederholung der Rollen-Guard-Pruefung fuer geschuetzte Pages
 * (/onboarding, /dashboard/*). Der Proxy allein ist keine Sicherheitsgrenze -- jede
 * geschuetzte Route muss die Pruefung serverseitig selbst nochmal machen.
 */
export async function enforceRouteGuard(pathname: string) {
  const supabase = await createClient();
  const { user, rolle } = await fetchSessionAndRolle(supabase);

  const target = determineRedirect({ pathname, hasSession: !!user, rolle });
  if (target) {
    redirect(target);
  }

  return { user, rolle };
}
