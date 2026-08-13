"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { onboardingFullSchema } from "@/lib/auth/validation";
import { createClient } from "@/lib/supabase/server";

export interface OnboardingState {
  error?: string;
}

export interface OnboardingSubmitData {
  rolle: "unternehmen" | "freelancer";
  anzeigename: string;
  firmenname?: string;
  // Unternehmen
  branche?: string | null;
  unternehmensgroesse?: string | null;
  gesuchte_leistungen?: string[];
  dringlichkeit?: string | null;
  // Freelancer
  spezialisierungen?: string[];
  branchen_erfahrung?: string[];
  erfahrung_jahre?: string;
  bio?: string;
  verfuegbarkeit?: string | null;
  verfuegbar_ab?: string;
}

export async function onboarding(submitData: OnboardingSubmitData): Promise<OnboardingState> {
  const parsed = onboardingFullSchema.safeParse(submitData);

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
    .update({
      rolle: parsed.data.rolle,
      anzeigename: parsed.data.anzeigename,
      firmenname: parsed.data.firmenname ?? null,
      branche: parsed.data.branche ?? null,
      unternehmensgroesse: parsed.data.unternehmensgroesse ?? null,
      gesuchte_leistungen: parsed.data.gesuchte_leistungen ?? null,
      dringlichkeit: parsed.data.dringlichkeit ?? null,
      spezialisierungen: parsed.data.spezialisierungen ?? null,
      branchen_erfahrung: parsed.data.branchen_erfahrung ?? null,
      erfahrung_jahre: parsed.data.erfahrung_jahre ?? null,
      bio: parsed.data.bio ?? null,
      verfuegbarkeit: parsed.data.verfuegbarkeit ?? null,
      verfuegbar_ab: parsed.data.verfuegbar_ab || null,
    })
    .eq("id", user.id);

  if (error) {
    return { error: "Speichern hat nicht geklappt. Bitte versuche es erneut." };
  }

  // Ohne das koennte Next's client-seitiger Router-Cache bei einem erneuten Login kurz
  // danach noch die alte (rollenlose) RSC-Antwort fuer /onboarding ausliefern.
  revalidatePath("/onboarding");

  return {};
}
