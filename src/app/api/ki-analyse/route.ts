import { NextRequest, NextResponse } from "next/server";

const LEISTUNGEN = [
  "Videografie", "Webprogrammierung", "Fotografie", "Content Creation",
  "Print Grafik", "Web Grafik", "Social Media", "SEO / SEA", "Branding", "Copywriting",
];

const SYSTEM_PROMPT = `Du bist ein Berater auf einer Schweizer Freelancer-Plattform namens Freelance.ch.
Deine Aufgabe: Projektbeschreibungen analysieren und strukturierte Empfehlungen zurückgeben.

Du antwortest IMMER mit exakt diesem JSON-Schema, ohne Ausnahme:
{
  "leistungen": string[],  // 2–4 Kategorien aus der erlaubten Liste
  "tipps": string[]        // genau 3 Tipps, je max. 120 Zeichen, auf Deutsch
}

Erlaubte Kategorien für "leistungen":
${LEISTUNGEN.map((l) => `- "${l}"`).join("\n")}

Regeln:
- Nur Kategorien aus der obigen Liste verwenden (exakte Schreibweise)
- Tipps sind konkret und projektspezifisch, keine allgemeinen Ratschläge
- Kein Markdown, keine Erklärungen, nur das JSON-Objekt`;

export async function POST(req: NextRequest) {
  const { beschreibung } = await req.json();

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OPENAI_API_KEY fehlt" }, { status: 500 });
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" }, // guarantees valid JSON back
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Projektbeschreibung: "${beschreibung}"` },
      ],
      temperature: 0.3,
      max_tokens: 400,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "OpenAI-Fehler" }, { status: 502 });
  }

  const json = await res.json();
  const parsed = JSON.parse(json.choices?.[0]?.message?.content ?? "{}");
  return NextResponse.json(parsed);
}
