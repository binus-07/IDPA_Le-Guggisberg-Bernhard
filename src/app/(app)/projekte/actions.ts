"use server";

import { createClient } from "@/lib/supabase/server";

type ProjektErstellen = {
  name: string;
  beschreibung: string;
  leistungen: string[];
  budget: string | null;
  zeitrahmen: string | null;
  modus: string;
};

export async function erstelleProjekt(data: ProjektErstellen) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Nicht angemeldet" };

  const { error } = await supabase.from("projekte").insert({
    unternehmen_id: user.id,
    name: data.name,
    beschreibung: data.beschreibung || null,
    leistungen: data.leistungen,
    budget: data.budget,
    zeitrahmen: data.zeitrahmen,
    modus: data.modus,
  });

  if (error) return { error: error.message };
  return { success: true };
}
