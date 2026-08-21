import type { Metadata } from "next";
import { enforceRouteGuard } from "@/lib/auth/server-guard";
import { getFreelancers } from "@/lib/mock/freelancer";
import { createClient } from "@/lib/supabase/server";
import type { Freelancer } from "@/lib/types/freelancer";
import { FreelancerUebersichtInhalt } from "./inhalt";

export const metadata: Metadata = {
  title: "Freelancer",
};

async function ladeFreelancer(): Promise<Freelancer[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("freelancer")
    .select(
      "freelancer_id,vorname,nachname,rolle,jahre_taetig,kurzbeschreibung,profile_image_url,rating",
    )
    .order("nachname", { ascending: true });

  return (data ?? []).map((fl) => ({
    id: String(fl.freelancer_id),
    name: `${fl.vorname} ${fl.nachname}`,
    rolle: fl.rolle as string,
    seitJahren: (fl.jahre_taetig as number | null) ?? undefined,
    beschreibung: (fl.kurzbeschreibung as string | null) ?? undefined,
    bildSrc: (fl.profile_image_url as string | null) ?? undefined,
    rating: (fl.rating as number | null) ?? undefined,
    empfohlen: false,
  }));
}

export default async function FreelancerUebersichtPage({
  searchParams,
}: {
  searchParams: Promise<{ skill?: string }>;
}) {
  await enforceRouteGuard("/freelancer");
  const { skill } = await searchParams;

  const [mockFreelancer, dbFreelancer] = await Promise.all([
    Promise.resolve(getFreelancers()),
    ladeFreelancer(),
  ]);
  const mockIds = new Set(mockFreelancer.map((f) => f.id));
  const alle = [...mockFreelancer, ...dbFreelancer.filter((f) => !mockIds.has(f.id))];

  const rollen = [...new Set(alle.map((f) => f.rolle))].sort((a, b) => a.localeCompare(b, "de"));
  const gefiltert = skill ? alle.filter((f) => f.rolle === skill) : alle;

  return (
    <FreelancerUebersichtInhalt
      freelancer={gefiltert}
      rollen={rollen}
      aktiveRolle={skill ?? null}
    />
  );
}
