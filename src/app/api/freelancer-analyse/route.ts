import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ─── System prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `Du bist ein Freelancer-Matching-Experte auf Freelance.ch, einer Schweizer Freelancer-Plattform.
Du erhältst drei CSV-Datensätze:
1) Freelancer: ID, Name, Rolle, Jahre_taetig, Bezahlung_CHF, Kurzbeschreibung
2) Projekte: Freelancer_ID, Titel, Bewertung (1–5), Beschreibung — Rohdaten für Erfahrung und Qualität
3) Marketing-Aktivitäten: Rolle, Kategorie, Aktivitaet, Beschreibung

Verknüpfe Freelancer und Marketing-Aktivitäten über die Rolle.
Berechne für jeden Freelancer die Ø-Bewertung aus den Projekten.
Antworte IMMER mit exakt diesem JSON-Objekt (kein Markdown, kein Text drumherum):
{
  "empfehlung": string,       // 2–3 Sätze auf Deutsch: warum diese Freelancer passen
  "freelancer_ids": string[], // 1–3 IDs der am besten passenden Freelancer
  "aktivitaeten": string[]    // 2–4 konkrete Aktivitäten aus dem Marketing-Aktivitäten-CSV
}`;

// ─── CSV builders ─────────────────────────────────────────────────────────────

type Row = Record<string, unknown>;

function esc(val: unknown): string {
  return `"${String(val ?? "").replace(/"/g, '""')}"`;
}

function buildFreelancerCsv(rows: Row[]): string {
  const header = "ID,Vorname,Nachname,Rolle,Jahre_taetig,Bezahlung_CHF,Kurzbeschreibung";
  const lines = rows.map((r) =>
    [r.freelancer_id, r.vorname, r.nachname, r.rolle, r.jahre_taetig, r.bezahlung_chf, esc(r.kurzbeschreibung)].join(",")
  );
  return [header, ...lines].join("\n");
}

function buildProjekteCsv(rows: Row[]): string {
  const header = "Freelancer_ID,Titel,Bewertung,Beschreibung";
  const lines = rows.map((r) =>
    [r.freelancer_id, esc(r.titel), r.bewertung, esc(r.beschreibung)].join(",")
  );
  return [header, ...lines].join("\n");
}

function buildAktivitaetenCsv(rows: Row[]): string {
  const header = "Rolle,Kategorie,Aktivitaet,Beschreibung";
  const lines = rows.map((r) =>
    [r.rolle, r.kategorie, esc(r.aktivitaet), esc(r.beschreibung)].join(",")
  );
  return [header, ...lines].join("\n");
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { frage, rolle } = body as { frage?: string; rolle?: string };

  if (!frage?.trim()) {
    return NextResponse.json({ error: "Frage fehlt" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OPENAI_API_KEY fehlt" }, { status: 500 });
  }

  const supabase = await createClient();

  // Fetch freelancer rows (optional filter by Rolle)
  let flQuery = supabase
    .from("freelancer")
    .select("freelancer_id,vorname,nachname,rolle,jahre_taetig,bezahlung_chf,kurzbeschreibung");
  if (rolle) flQuery = flQuery.eq("rolle", rolle);
  const { data: freelancerRows, error: flError } = await flQuery;
  if (flError) return NextResponse.json({ error: "Supabase: freelancer" }, { status: 502 });

  // Fetch raw project data for those freelancers
  const ids = (freelancerRows ?? []).map((f) => f.freelancer_id);
  let projekteRows: Row[] = [];
  if (ids.length > 0) {
    const { data, error } = await supabase
      .from("freelancer_projekte")
      .select("freelancer_id,titel,bewertung,beschreibung")
      .in("freelancer_id", ids);
    if (!error) projekteRows = (data ?? []) as Row[];
  }

  // Fetch marketing activities (optional filter by Rolle)
  let mktQuery = supabase
    .from("marketing_aktivitaeten")
    .select("rolle,kategorie,aktivitaet,beschreibung");
  if (rolle) mktQuery = mktQuery.eq("rolle", rolle);
  const { data: aktivRows, error: aktivError } = await mktQuery;
  if (aktivError) return NextResponse.json({ error: "Supabase: marketing_aktivitaeten" }, { status: 502 });

  // Build prompt
  const freelancerCsv = buildFreelancerCsv((freelancerRows ?? []) as Row[]);
  const projekteCsv = buildProjekteCsv(projekteRows);
  const aktivitaetenCsv = buildAktivitaetenCsv((aktivRows ?? []) as Row[]);

  const userMessage =
    `Freelancer:\n${freelancerCsv}\n\n` +
    `Projekte:\n${projekteCsv}\n\n` +
    `Marketing-Aktivitäten:\n${aktivitaetenCsv}\n\n` +
    `Frage: ${frage}`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.3,
      max_tokens: 600,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "OpenAI-Fehler" }, { status: 502 });
  }

  const json = await res.json();
  const parsed = JSON.parse(json.choices?.[0]?.message?.content ?? "{}");
  return NextResponse.json(parsed);
}
