import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.getSession();

    if (error) {
      return NextResponse.json({ status: "error", supabase: false });
    }

    return NextResponse.json({ status: "ok", supabase: true });
  } catch {
    return NextResponse.json({ status: "error", supabase: false });
  }
}
