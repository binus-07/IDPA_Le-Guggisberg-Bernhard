import type { Metadata } from "next";
import { enforceRouteGuard } from "@/lib/auth/server-guard";
import { getProjekte } from "@/lib/mock/projekte";
import { FreelancerDashboardInhalt } from "./inhalt";

export const metadata: Metadata = {
  title: "Home – Freelancer",
};

export default async function FreelancerDashboardPage() {
  await enforceRouteGuard("/dashboard/freelancer");

  const projekte = getProjekte();
  // Kein Freelancer-Datenmodell in Phase B -- Mock-Teilaufgaben dienen nur als Platzhalter fuer
  // "offene Anfragen", nicht als echte, dem eingeloggten Freelancer zugeordnete Auftraege.
  // TODO Phase C: durch echte, dem Konto zugeordnete Anfragen ersetzen.
  const offeneAnfragen = projekte.flatMap((projekt) => projekt.teilaufgaben);

  return <FreelancerDashboardInhalt offeneAnfragen={offeneAnfragen} projekte={projekte} />;
}
