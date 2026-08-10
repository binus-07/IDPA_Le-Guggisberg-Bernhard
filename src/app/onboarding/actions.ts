"use server";

import { redirect } from "next/navigation";
import { onboardingSchema } from "@/lib/auth/validation";
import { createClient } from "@/lib/supabase/server";

export interface OnboardingState {
  error?: string;
}

export async function onboarding(
  _prevState: OnboardingState,
  formData: FormData,
): Promise<OnboardingState> {
  const parsed = onboardingSchema.safeParse({
    rolle: formData.get("rolle"),
    anzeigename: formData.get("anzeigename"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Bitte die Eingaben prüfen." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/anmelden?redirect=%2Fonboarding");
  }

  const { error } = await supabase
    .from("profiles")
    .update({ rolle: parsed.data.rolle, anzeigename: parsed.data.anzeigename })
    .eq("id", user.id);

  if (error) {
    return { error: "Speichern hat nicht geklappt. Bitte versuche es erneut." };
  }

  redirect(`/dashboard/${parsed.data.rolle}`);
}
