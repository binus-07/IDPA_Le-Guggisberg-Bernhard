import { NextResponse } from "next/server";

// Verhindert, dass Next.js die Route zur Build-Zeit statisch auswertet.
// Ein Health-Check muss bei jedem Aufruf frisch laufen.
export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return NextResponse.json(
      { status: "error", supabase: false, reason: "env_missing" },
      { status: 503 },
    );
  }

  try {
    // Echter HTTP-Roundtrip gegen den Auth-Dienst von Supabase.
    // Antwortet nur mit 200, wenn URL erreichbar UND Key gueltig ist.
    const res = await fetch(`${url}/auth/v1/health`, {
      headers: { apikey: key },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { status: "error", supabase: false, reason: `http_${res.status}` },
        { status: 503 },
      );
    }

    return NextResponse.json({
      status: "ok",
      supabase: true,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { status: "error", supabase: false, reason: "unreachable" },
      { status: 503 },
    );
  }
}
