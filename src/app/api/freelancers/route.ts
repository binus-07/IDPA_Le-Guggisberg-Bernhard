import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const ids = req.nextUrl.searchParams.get("ids")?.split(",").filter(Boolean) ?? [];
  if (!ids.length) return NextResponse.json([]);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("freelancer")
    .select("freelancer_id,vorname,nachname,rolle,jahre_taetig,profile_image_url,rating")
    .in("freelancer_id", ids);
  if (error) return NextResponse.json([], { status: 502 });
  return NextResponse.json(
    (data ?? []).map((r: Record<string, unknown>) => ({
      id: String(r.freelancer_id),
      name: `${r.vorname} ${r.nachname}`,
      rolle: r.rolle as string,
      seitJahren: (r.jahre_taetig as number | null) ?? undefined,
      bildSrc: (r.profile_image_url as string | null) ?? undefined,
      rating: (r.rating as number | null) ?? undefined,
    })),
  );
}
