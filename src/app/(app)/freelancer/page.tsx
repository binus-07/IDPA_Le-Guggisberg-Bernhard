import type { Metadata } from "next";
import { enforceRouteGuard } from "@/lib/auth/server-guard";
import { getFreelancers } from "@/lib/mock/freelancer";
import { createClient } from "@/lib/supabase/server";
import { kategorieFuerRolle, kategorienFuerRollen } from "@/lib/freelancer-categories";
import type { Freelancer } from "@/lib/types/freelancer";
import { FreelancerUebersichtInhalt } from "./inhalt";

export const metadata: Metadata = {
  title: "Freelancer",
};

async function ladeFreelancer(): Promise<{ freelancer: Freelancer[]; fehler: boolean }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("freelancer")
    .select(
      "freelancer_id,vorname,nachname,rolle,jahre_taetig,kurzbeschreibung,profile_image_url,rating",
    )
    .order("nachname", { ascending: true });

  if (error) {
    console.error("Fehler beim Laden der Freelancer:", error);
    return { freelancer: [], fehler: true };
  }

  return {
    freelancer: (data ?? []).map((fl) => ({
      id: String(fl.freelancer_id),
      name: `${fl.vorname} ${fl.nachname}`,
      rolle: fl.rolle as string,
      seitJahren: (fl.jahre_taetig as number | null) ?? undefined,
      beschreibung: (fl.kurzbeschreibung as string | null) ?? undefined,
      bildSrc: (fl.profile_image_url as string | null) ?? undefined,
      rating: (fl.rating as number | null) ?? undefined,
      empfohlen: false,
    })),
    fehler: false,
  };
}

export default async function FreelancerUebersichtPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  await enforceRouteGuard("/freelancer");
  const { category } = await searchParams;

  const [mockFreelancer, { freelancer: dbFreelancer, fehler }] = await Promise.all([
    Promise.resolve(getFreelancers()),
    ladeFreelancer(),
  ]);
  const mockIds = new Set(mockFreelancer.map((f) => f.id));
  const alle = [...mockFreelancer, ...dbFreelancer.filter((f) => !mockIds.has(f.id))];

  const kategorien = kategorienFuerRollen(alle.map((f) => f.rolle));
  // Unbekannte Kategorie im URL-Param faellt sinnvoll auf "Alle" zurueck, statt zu crashen oder
  // einen leeren Zustand vorzutaeuschen.
  const aktiveKategorie = category && kategorien.some((k) => k.key === category) ? category : null;
  const gefiltert = aktiveKategorie
    ? alle.filter((f) => kategorieFuerRolle(f.rolle) === aktiveKategorie)
    : alle;

  return (
    <FreelancerUebersichtInhalt
      freelancer={gefiltert}
      kategorien={kategorien}
      aktiveKategorie={aktiveKategorie}
      fehler={fehler}
    />
  );
}
