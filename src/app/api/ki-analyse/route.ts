import { NextRequest, NextResponse } from "next/server";

// ─── Allowed service categories ───────────────────────────────────────────────

const LEISTUNGEN = [
  "Videografie", "Webprogrammierung", "Fotografie", "Content Creation",
  "Print Grafik", "Web Grafik", "Social Media", "SEO / SEA", "Branding", "Copywriting",
];

const LEISTUNGEN_LIST = LEISTUNGEN.map((l) => `- "${l}"`).join("\n");

// ─── Shared schema / rules injected into every prompt ────────────────────────

const JSON_SCHEMA = `{
  "strategie": string,      // 1–2 Sätze: warum diese Empfehlung — spezifisch auf den Fall bezogen, auf Deutsch
  "leistungen": string[],   // 2–4 Kategorien aus der erlaubten Liste
  "tipps": string[]         // genau 3 Tipps, je max. 130 Zeichen, auf Deutsch
}`;

const BASE_RULES = `
Erlaubte Kategorien für "leistungen":
${LEISTUNGEN_LIST}

Regeln:
- Nur Kategorien aus der obigen Liste (exakte Schreibweise)
- 2–4 Kategorien zurückgeben
- Tipps: konkret, auf den spezifischen Fall bezogen, max. 130 Zeichen
- Kein Markdown, keine Erklärungen außerhalb des JSON — nur das JSON-Objekt`;

// ─── System prompt: Fragebogen A (Marke / Brand) ─────────────────────────────

const SYSTEM_MARKE = `Du bist ein strategischer Brand-Berater auf Freelance.ch, einer Schweizer Freelancer-Plattform.
Aufgabe: Marken-Fragebogen analysieren und passende Freelancer-Leistungen empfehlen.
Fokus: Markenaufbau, Image, Bekanntheit — kein direkter Abverkauf, kein Performance-Fokus.

Antworte IMMER mit exakt diesem JSON:
${JSON_SCHEMA}
${BASE_RULES}

Marken-Prioritäten (leite Empfehlung daraus ab):
- Markenziel "Bekanntheit aufbauen"     → Branding, Social Media, Content Creation
- Markenziel "Image verbessern"         → Branding, Fotografie, Copywriting
- Markenziel "Vertrauen stärken"        → Copywriting, Fotografie, Content Creation
- Markenziel "Neue Zielgruppe"          → Social Media, Content Creation, Branding
- Markenziel "Employer Branding"        → Copywriting, Fotografie, Branding
- Markenziel "Community / Loyalität"    → Social Media, Content Creation
- Tonalität "Minimalistisch & premium"  → Fotografie, Branding höher gewichten
- Tonalität "Verspielt & kreativ"       → Content Creation, Web Grafik höher gewichten
- Kanal "LinkedIn / B2B"                → Copywriting, Branding, Web Grafik
- Kanal "TikTok / Instagram"            → Social Media, Videografie, Content Creation
- Tipps sollen auf Markenziel, Zielgruppe, Tonalität und CI/CD-Status eingehen`;

// ─── System prompt: Fragebogen B (Produkt / Dienstleistung) ──────────────────

const SYSTEM_PRODUKT = `Du bist ein Performance-Marketing-Berater auf Freelance.ch, einer Schweizer Freelancer-Plattform.
Aufgabe: Produkt-Fragebogen analysieren und conversion-orientierte Freelancer-Leistungen empfehlen.
Fokus: Verkäufe, Leads, Conversions, Downloads — messbar und transaktional.

Antworte IMMER mit exakt diesem JSON:
${JSON_SCHEMA}
${BASE_RULES}

Produkt-Prioritäten (leite Empfehlung daraus ab):
- Ziel "Erstverkäufe / Launch"          → Social Media, Content Creation, Branding
- Ziel "Leads / B2B"                    → Copywriting, SEO / SEA, Web Grafik
- Ziel "Online-Verkäufe / Conversions"  → SEO / SEA, Webprogrammierung, Web Grafik
- Ziel "Lokale Nachfrage"               → Print Grafik, Fotografie, Social Media
- Ziel "Retention / Wiederkauf"         → Copywriting, Content Creation
- Ziel "Upsell"                         → Copywriting, Web Grafik
- Ziel "App-Downloads"                  → Social Media, Content Creation, Web Grafik
- Preissegment "Premium / Luxus"        → Fotografie, Branding höher gewichten
- Preissegment "Günstig"                → SEO / SEA, Copywriting höher gewichten
- Status "Neu / Launch"                 → Branding stärker berücksichtigen
- Tipps sollen auf Marketingziel, USP, Preissegment und Zeitrahmen eingehen`;

// ─── Fallback prompt (altes Freitextformat) ───────────────────────────────────

const SYSTEM_FALLBACK = `Du bist ein Marketing-Berater auf Freelance.ch, einer Schweizer Freelancer-Plattform.
Aufgabe: Projektbeschreibung analysieren und passende Freelancer-Leistungen empfehlen.

Antworte IMMER mit exakt diesem JSON:
${JSON_SCHEMA}
${BASE_RULES}`;

// ─── Prompt builders ─────────────────────────────────────────────────────────

function buildMarkenPrompt(d: Record<string, unknown>): string {
  const lines = [
    `Unternehmenstyp: ${d.unternehmenstyp}${d.unternehmenstypSonstige ? ` (${d.unternehmenstypSonstige})` : ""}`,
    `Unternehmensgrösse: ${d.unternehmensgroesse}`,
    `Markenziel: ${d.markenziel}`,
    `Zielgruppe (Segment): ${(d.zielgruppeSegment as string[])?.join(", ")}`,
    `Zielgruppe (Alter): ${(d.zielgruppeAlter as string[])?.join(", ")}`,
    d.zielgruppeBeschreibung ? `Zielgruppenbeschreibung: "${d.zielgruppeBeschreibung}"` : null,
    `CI/CD-Status: ${d.cicdStatus}`,
    d.cicdEinhaltung ? `CI/CD-Einhaltung: ${d.cicdEinhaltung}` : null,
    d.cicdVorgaben ? `CI/CD-Vorgaben: "${d.cicdVorgaben}"` : null,
    `Aktuelle Kanäle: ${(d.kanaele as string[])?.join(", ")}`,
    `Gewünschte Tonalität: ${d.tonalitaet}`,
    `Markenstärke / USP: "${d.markenstärke}"`,
    `Zusammenarbeit: ${d.zusammenarbeit}`,
    d.budget ? `Budget: ${d.budget}` : null,
  ];
  return `[Fragebogen A — Marke]\n${lines.filter(Boolean).join("\n")}`;
}

function buildProduktPrompt(d: Record<string, unknown>): string {
  const leistungenSelbst = (d.leistungen as string[])?.join(", ");
  const lines = [
    `Angebotstyp: ${d.angebotstyp}`,
    `Produktstatus: ${d.produktstatus}`,
    `Marketingziel: ${d.marketingziel}`,
    `Zielgruppe (Segment): ${d.zielgruppeSegment}`,
    `Zielgruppe (Alter): ${(d.zielgruppeAlter as string[])?.join(", ")}`,
    d.zielgruppeBeschreibung ? `Käuferprofil: "${d.zielgruppeBeschreibung}"` : null,
    `USP: "${d.usp}"`,
    `Preissegment: ${d.preissegment}`,
    `CI/CD-Status: ${d.cicdStatus}`,
    d.cicdEinhaltung ? `Design-Einhaltung: ${d.cicdEinhaltung}` : null,
    d.cicdVorgaben ? `Design-Vorgaben: "${d.cicdVorgaben}"` : null,
    leistungenSelbst ? `Vom Kunden gewünschte Leistungen: ${leistungenSelbst}` : null,
    `Zeitrahmen: ${d.zeitrahmen}`,
    `Zusammenarbeit: ${d.zusammenarbeit}`,
    d.budget ? `Budget: ${d.budget}` : null,
  ];
  return `[Fragebogen B — Produkt]\n${lines.filter(Boolean).join("\n")}`;
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { fragebogenTyp, fragebogenA, fragebogenB, beschreibung } = body as {
    fragebogenTyp?: string;
    fragebogenA?: Record<string, unknown>;
    fragebogenB?: Record<string, unknown>;
    beschreibung?: string;
  };

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OPENAI_API_KEY fehlt" }, { status: 500 });
  }

  let systemPrompt: string;
  let userMessage: string;

  if (fragebogenTyp === "marke" && fragebogenA) {
    systemPrompt = SYSTEM_MARKE;
    userMessage = buildMarkenPrompt(fragebogenA);
  } else if (fragebogenTyp === "produkt" && fragebogenB) {
    systemPrompt = SYSTEM_PRODUKT;
    userMessage = buildProduktPrompt(fragebogenB);
  } else {
    systemPrompt = SYSTEM_FALLBACK;
    userMessage = `Projektbeschreibung: "${beschreibung ?? ""}"`;
  }

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
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.3,
      max_tokens: 500,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "OpenAI-Fehler" }, { status: 502 });
  }

  const json = await res.json();
  const parsed = JSON.parse(json.choices?.[0]?.message?.content ?? "{}");
  return NextResponse.json(parsed);
}
