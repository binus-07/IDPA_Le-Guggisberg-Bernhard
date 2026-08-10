"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { translateAuthError } from "@/lib/auth/error-messages";
import { registrierenSchema } from "@/lib/auth/validation";
import { createClient } from "@/lib/supabase/server";

export interface RegistrierenState {
  error?: string;
  emailBestaetigungNoetig?: boolean;
}

export async function registrieren(
  _prevState: RegistrierenState,
  formData: FormData,
): Promise<RegistrierenState> {
  const parsed = registrierenSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Bitte die Eingaben prüfen." };
  }

  // headers() statt window.location.origin: Server Actions laufen serverseitig, "window"
  // existiert dort nicht. Gleiches Muster wie in passwort-vergessen/actions.ts.
  const origin = (await headers()).get("origin");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${origin}/auth/confirm?next=/onboarding`,
    },
  });

  if (error) {
    return { error: translateAuthError(error) };
  }

  if (!data.session) {
    // E-Mail-Bestaetigung ist aktiv (Standard im verbundenen Produktions-Supabase-Projekt) --
    // ohne Session gibt es noch nichts, worauf proxy.ts das Onboarding aufbauen koennte.
    return { emailBestaetigungNoetig: true };
  }

  redirect("/onboarding");
}
