import type { Metadata } from "next";
import { enforceRouteGuard } from "@/lib/auth/server-guard";
import { getProjekte } from "@/lib/mock/projekte";
import { ProjekteUebersichtInhalt } from "./inhalt";

export const metadata: Metadata = {
  title: "Projekte",
};

export default async function ProjekteUebersichtPage() {
  await enforceRouteGuard("/projekte");

  return <ProjekteUebersichtInhalt projekte={getProjekte()} />;
}
