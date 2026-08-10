"use server";

import { redirect } from "next/navigation";
import { isSafeRedirectTarget } from "@/lib/auth/route-guard";
import { translateAuthError } from "@/lib/auth/error-messages";
import { fetchSessionAndRolle } from "@/lib/auth/session";
import { anmeldenSchema } from "@/lib/auth/validation";
import { createClient } from "@/lib/supabase/server";

export interface AnmeldenState {
  error?: string;
}

export async function anmelden(
  _prevState: AnmeldenState,
  formData: FormData,
): Promise<AnmeldenState> {
  const parsed = anmeldenSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Bitte die Eingaben prüfen." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: translateAuthError(error) };
  }

  const redirectParam = formData.get("redirect");
  if (typeof redirectParam === "string" && isSafeRedirectTarget(redirectParam)) {
    redirect(redirectParam);
  }

  // Ohne explizites redirect-Ziel direkt zum passenden Ort weiterleiten (Onboarding oder
  // eigenes Dashboard), statt ueber /onboarding zu gehen und auf eine zweite Umleitung durch
  // den Proxy zu setzen: ein Redirect direkt im Anschluss an eine Server Action wird vom
  // Next.js-Client bei der naechsten, vom Proxy nochmals umgeleiteten Navigation nicht
  // zuverlaessig verfolgt (RSC-Fetch der Server Action, nicht die volle Browser-Navigation).
  const { rolle } = await fetchSessionAndRolle(supabase);
  redirect(rolle ? `/dashboard/${rolle}` : "/onboarding");
}
