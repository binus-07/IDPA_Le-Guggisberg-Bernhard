import type { Metadata } from "next";
import { enforceRouteGuard } from "@/lib/auth/server-guard";
import { getTopFreelancer } from "@/lib/mock/freelancer";
import { getKategorien } from "@/lib/mock/kategorien";
import { getProjekte } from "@/lib/mock/projekte";
import { UnternehmenDashboardInhalt } from "./inhalt";

export const metadata: Metadata = {
  title: "Home – Unternehmen",
};

export default async function UnternehmenDashboardPage() {
  await enforceRouteGuard("/dashboard/unternehmen");

  return (
    <UnternehmenDashboardInhalt
      kategorien={getKategorien()}
      topFreelancer={getTopFreelancer()}
      projekte={getProjekte()}
    />
  );
}
