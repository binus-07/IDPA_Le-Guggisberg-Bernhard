import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { enforceRouteGuard } from "@/lib/auth/server-guard";
import { getFreelancer } from "@/lib/mock/freelancer";
import { createClient } from "@/lib/supabase/server";
import type { Freelancer, BisherigesProjekt } from "@/lib/types/freelancer";
import { FreelancerDetailInhalt } from "./inhalt";

async function getFreelancerFromDb(id: string): Promise<Freelancer | null> {
  const supabase = await createClient();

  const { data: fl } = await supabase
    .from("freelancer")
    .select(
      "freelancer_id,vorname,nachname,rolle,jahre_taetig,kurzbeschreibung,bio,profile_image_url,rating",
    )
    .eq("freelancer_id", id)
    .single();

  if (!fl) return null;

  const { data: projekte } = await supabase
    .from("freelancer_projekte")
    .select("titel,beschreibung,bewertung")
    .eq("freelancer_id", id);

  const bisherigeProjekte: BisherigesProjekt[] = (projekte ?? []).map((p) => ({
    titel: (p.titel as string) ?? "Projekt",
    beschreibung: (p.beschreibung as string) ?? "",
    kommentar: "",
    datum: "",
    bewertung: (p.bewertung as number) ?? 3,
  }));

  return {
    id: String(fl.freelancer_id),
    name: `${fl.vorname} ${fl.nachname}`,
    rolle: fl.rolle as string,
    seitJahren: (fl.jahre_taetig as number | null) ?? undefined,
    beschreibung: (fl.kurzbeschreibung as string | null) ?? undefined,
    bio: (fl.bio as string | null) ?? undefined,
    bildSrc: (fl.profile_image_url as string | null) ?? undefined,
    rating: (fl.rating as number | null) ?? undefined,
    bisherigeProjekte,
    empfohlen: false,
  };
}

export async function generateMetadata({
  params,
}: PageProps<"/freelancer/[id]">): Promise<Metadata> {
  const { id } = await params;
  const freelancer = getFreelancer(id) ?? (await getFreelancerFromDb(id));
  return { title: freelancer ? `${freelancer.name} – Freelancer` : "Freelancer nicht gefunden" };
}

export default async function FreelancerDetailPage({ params }: PageProps<"/freelancer/[id]">) {
  const { id } = await params;
  await enforceRouteGuard(`/freelancer/${id}`);

  const freelancer = getFreelancer(id) ?? (await getFreelancerFromDb(id));

  if (!freelancer) {
    notFound();
  }

  return <FreelancerDetailInhalt freelancer={freelancer} />;
}
