import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";
import { fetchSessionAndRolle } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { rolle } = await fetchSessionAndRolle(supabase);

  return <AppShell rolle={rolle}>{children}</AppShell>;
}
