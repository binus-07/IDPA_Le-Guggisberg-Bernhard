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
    return NextResponse.json(aktivitaeten.map((a) => ({ aktivitaet: a, rolle: null, freelancer: [] })));
  }

  const { data: flRows, error: flError } = await supabase
    .from("freelancer")
    .select("freelancer_id,vorname,nachname,rolle,jahre_taetig,bezahlung_chf")
    .in("rolle", rollen);

  if (flError) return NextResponse.json([], { status: 502 });

  // Fetch average ratings
  const allIds = (flRows ?? []).map((f) => f.freelancer_id as string);
  const bewertungMap = new Map<string, number>();
  if (allIds.length > 0) {
    const { data: projRows } = await supabase
      .from("freelancer_projekte")
      .select("freelancer_id,bewertung")
      .in("freelancer_id", allIds);
    const sumMap = new Map<string, { sum: number; count: number }>();
    for (const p of projRows ?? []) {
      const id = p.freelancer_id as string;
      const bew = p.bewertung as number | null;
      if (bew == null) continue;
      if (!sumMap.has(id)) sumMap.set(id, { sum: 0, count: 0 });
      const e = sumMap.get(id)!;
      e.sum += bew;
      e.count += 1;
    }
    for (const [id, { sum, count }] of sumMap) {
      bewertungMap.set(id, Math.round((sum / count) * 10) / 10);
    }
  }

  const freelancerByRolle = new Map<string, {
    id: string; name: string; rolle: string;
    jahre: number | null; bezahlung: number | null; bewertung: number | null;
  }[]>();

  for (const f of flRows ?? []) {
    const rolle = f.rolle as string;
    if (!freelancerByRolle.has(rolle)) freelancerByRolle.set(rolle, []);
    const id = String(f.freelancer_id);
    freelancerByRolle.get(rolle)!.push({
      id,
      name: `${f.vorname} ${f.nachname}`,
      rolle,
      jahre: (f.jahre_taetig as number | null) ?? null,
      bezahlung: (f.bezahlung_chf as number | null) ?? null,
      bewertung: bewertungMap.get(id) ?? null,
    });
  }

  const result = aktivitaeten.map((a) => {
    const rolle = aktivitaetRolle.get(a) ?? null;
    const freelancer = rolle ? (freelancerByRolle.get(rolle) ?? []) : [];
    return { aktivitaet: a, rolle, freelancer };
  });

  return NextResponse.json(result);
}
