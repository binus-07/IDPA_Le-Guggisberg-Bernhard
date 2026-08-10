"use server";

import { redirect } from "next/navigation";
import { translateAuthError } from "@/lib/auth/error-messages";
import { passwortNeuSchema } from "@/lib/auth/validation";
import { createClient } from "@/lib/supabase/server";

export interface PasswortNeuState {
  error?: string;
}

export async function passwortNeuSetzen(
  _prevState: PasswortNeuState,
  formData: FormData,
): Promise<PasswortNeuState> {
  const parsed = passwortNeuSchema.safeParse({ password: formData.get("password") });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Bitte die Eingaben prüfen." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Keine (Recovery-)Session mehr vorhanden -- der Link war vermutlich abgelaufen.
    redirect("/passwort-vergessen");
  }

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });

  if (error) {
    return { error: translateAuthError(error) };
  }

  redirect("/onboarding");
}
