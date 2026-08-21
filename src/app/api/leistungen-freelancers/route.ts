import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const LEISTUNG_ZU_ROLLE: Record<string, string | null> = {
  Videografie: "Videograf",
  Webprogrammierung: "Webprogrammierer",
  Fotografie: "Fotograf",
  "Content Creation": "Content Creator",
  "Print Grafik": "Print-Grafiker",
  "Web Grafik": "Web-Grafiker",
  "Social Media": "Content Creator",
  "SEO / SEA": null,
  Branding: "Web-Grafiker",
  Copywriting: "Content Creator",
};

export async function POST(req: NextRequest) {
  const { aktivitaeten } = (await req.json()) as { aktivitaeten: string[] };
  if (!Array.isArray(aktivitaeten) || aktivitaeten.length === 0) {
    return NextResponse.json([]);
  }

  const rollen = [
    ...new Set(
      aktivitaeten.map((l) => LEISTUNG_ZU_ROLLE[l] ?? null).filter((r): r is string => r !== null),
    ),
  ];

  const supabase = await createClient();

  const { data: flRows } = await supabase
    .from("freelancer")
    .select(
      "freelancer_id,vorname,nachname,rolle,jahre_taetig,bezahlung_chf,profile_image_url,rating",
    )
    .in("rolle", rollen.length > 0 ? rollen : ["__none__"]);

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

  const result = aktivitaeten.map((leistung) => {
    const rolle = LEISTUNG_ZU_ROLLE[leistung] ?? null;
    const freelancer = rolle ? (freelancerByRolle.get(rolle) ?? []) : [];
    return { aktivitaet: leistung, rolle, freelancer };
  });

  return NextResponse.json(result);
}
