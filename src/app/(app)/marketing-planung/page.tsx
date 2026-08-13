import type { Metadata } from "next";
import { enforceRouteGuard } from "@/lib/auth/server-guard";
import { getFreelancers } from "@/lib/mock/freelancer";
import { MarketingPlanungInhalt } from "./inhalt";

export const metadata: Metadata = {
  title: "Marketing Planung – Freelancer-Auswahl",
};

export default async function MarketingPlanungPage() {
  await enforceRouteGuard("/marketing-planung");

  return <MarketingPlanungInhalt freelancer={getFreelancers()} />;
}
