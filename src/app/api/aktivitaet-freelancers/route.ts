import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { aktivitaeten } = (await req.json()) as { aktivitaeten: string[] };
  if (!Array.isArray(aktivitaeten) || aktivitaeten.length === 0) {
    return NextResponse.json([]);
  }

  const supabase = await createClient();

  const { data: mktRows, error: mktError } = await supabase
    .from("marketing_aktivitaeten")
    .select("aktivitaet,rolle")
    .in("aktivitaet", aktivitaeten);

  if (mktError) return NextResponse.json([], { status: 502 });

  const aktivitaetRolle = new Map<string, string>();
  for (const row of mktRows ?? []) {
    aktivitaetRolle.set(row.aktivitaet as string, row.rolle as string);
  }

  const rollen = [...new Set(aktivitaetRolle.values())];
  if (rollen.length === 0) {
    return NextResponse.json(
      aktivitaeten.map((a) => ({ aktivitaet: a, rolle: null, freelancer: [] })),
    );
  }

  const { data: flRows, error: flError } = await supabase
    .from("freelancer")
    .select(
      "freelancer_id,vorname,nachname,rolle,jahre_taetig,bezahlung_chf,profile_image_url,rating",
    )
    .in("rolle", rollen);

  if (flError) return NextResponse.json([], { status: 502 });

  const freelancerByRolle = new Map<
    string,
    {
      id: string;
      name: string;
      rolle: string;
      jahre: number | null;
      bezahlung: number | null;
      bewertung: number | null;
      bildSrc: string | null;
    }[]
  >();

  for (const f of flRows ?? []) {
    const rolle = f.rolle as string;
    if (!freelancerByRolle.has(rolle)) freelancerByRolle.set(rolle, []);
    freelancerByRolle.get(rolle)!.push({
      id: String(f.freelancer_id),
      name: `${f.vorname} ${f.nachname}`,
      rolle,
      jahre: (f.jahre_taetig as number | null) ?? null,
      bezahlung: (f.bezahlung_chf as number | null) ?? null,
      bewertung: (f.rating as number | null) ?? null,
      bildSrc: (f.profile_image_url as string | null) ?? null,
    });
  }

  const result = aktivitaeten.map((a) => {
    const rolle = aktivitaetRolle.get(a) ?? null;
    const freelancer = rolle ? (freelancerByRolle.get(rolle) ?? []) : [];
    return { aktivitaet: a, rolle, freelancer };
  });

  return NextResponse.json(result);
}
