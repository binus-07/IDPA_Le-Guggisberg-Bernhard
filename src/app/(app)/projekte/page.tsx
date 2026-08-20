import type { Metadata } from "next";
import { enforceRouteGuard } from "@/lib/auth/server-guard";
import { getProjekte } from "@/lib/mock/projekte";
import { ladeProjekte } from "./actions";
import { ProjekteUebersichtInhalt } from "./inhalt";

export const metadata: Metadata = {
  title: "Projekte",
};

export default async function ProjekteUebersichtPage() {
  await enforceRouteGuard("/projekte");
  const [mockProjekte, dbProjekte] = await Promise.all([
    Promise.resolve(getProjekte()),
    ladeProjekte(),
  ]);

  return <ProjekteUebersichtInhalt projekte={[...mockProjekte, ...dbProjekte]} />;
}
