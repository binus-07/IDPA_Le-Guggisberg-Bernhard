"use server";

import { headers } from "next/headers";
import { translateAuthError } from "@/lib/auth/error-messages";
import { passwortVergessenSchema } from "@/lib/auth/validation";
import { createClient } from "@/lib/supabase/server";

export interface PasswortVergessenState {
  error?: string;
  gesendet?: boolean;
}

export async function passwortVergessenAnfordern(
  _prevState: PasswortVergessenState,
  formData: FormData,
): Promise<PasswortVergessenState> {
  const parsed = passwortVergessenSchema.safeParse({ email: formData.get("email") });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Bitte die Eingaben prüfen." };
  }

  const origin = (await headers()).get("origin");
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${origin}/auth/confirm?next=/passwort-neu`,
  });

  if (error) {
    return { error: translateAuthError(error) };
  }

  // Supabase antwortet bewusst immer mit Erfolg, auch wenn die E-Mail nicht existiert --
  // das verhindert, dass sich per Fehlermeldung herausfinden liesse, welche Adressen
  // registriert sind (Nutzer-Enumeration).
  return { gesendet: true };
}
