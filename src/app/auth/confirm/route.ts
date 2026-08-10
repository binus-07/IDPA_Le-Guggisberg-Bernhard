import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { isSafeRedirectTarget } from "@/lib/auth/route-guard";
import { createClient } from "@/lib/supabase/server";

// Handler fuer die Links aus Supabase-Auth-E-Mails (Passwort-Reset, ggf. spaeter
// Signup-Bestaetigung). Tauscht den token_hash gegen eine Session, siehe
// node_modules/@supabase/auth-js/dist/main/GoTrueClient.d.ts (verifyOtp mit token_hash).
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const nextParam = searchParams.get("next") ?? "/";
  const next = isSafeRedirectTarget(nextParam) ? nextParam : "/";

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) {
      return NextResponse.redirect(new URL(next, origin));
    }
  }

  return NextResponse.redirect(new URL("/anmelden", origin));
}
