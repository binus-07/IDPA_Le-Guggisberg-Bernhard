"use server";

import { createClient } from "@/lib/supabase/server";
import type { Projekt } from "@/lib/types/projekt";

type ProjektErstellen = {
  name: string;
  beschreibung: string;
  leistungen: string[];
  budget: string | null;
  zeitrahmen: string | null;
  modus: string;
  freelancerIds: string[];
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
    freelancer_ids: data.freelancerIds,
  });

  if (error) return { error: error.message };
  return { success: true };
}

function dbRowToProjekt(row: Record<string, unknown>): Projekt {
  const leistungen = (row.leistungen as string[] | null) ?? [];
  return {
    id: row.id as string,
    titel: row.name as string,
    auftragsbeschreibung: (row.beschreibung as string | null) ?? "",
    teilaufgaben: leistungen.map((l) => ({ titel: l, fortschrittProzent: 0 })),
  };
}

export async function ladeProjekte(): Promise<Projekt[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("projekte")
    .select("id, name, beschreibung, leistungen")
    .eq("unternehmen_id", user.id)
    .order("erstellt_am", { ascending: false });

  return (data ?? []).map(dbRowToProjekt);
}

export async function ladeProjekt(id: string): Promise<Projekt | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projekte")
    .select("id, name, beschreibung, leistungen")
    .eq("id", id)
    .single();

  if (!data) return null;
  return dbRowToProjekt(data);
}
