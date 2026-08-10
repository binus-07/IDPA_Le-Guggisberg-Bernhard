"use server";

import { redirect } from "next/navigation";
import { isSafeRedirectTarget } from "@/lib/auth/route-guard";
import { translateAuthError } from "@/lib/auth/error-messages";
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

  // Ohne gueltiges redirect-Ziel geht es auf /onboarding -- der Proxy leitet von dort
  // automatisch weiter zum passenden Dashboard, falls bereits eine Rolle gesetzt ist.
  const redirectParam = formData.get("redirect");
  const target =
    typeof redirectParam === "string" && isSafeRedirectTarget(redirectParam)
      ? redirectParam
      : "/onboarding";

  redirect(target);
}
