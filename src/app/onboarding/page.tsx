import type { Metadata } from "next";
import { enforceRouteGuard } from "@/lib/auth/server-guard";
import { OnboardingForm } from "./onboarding-form";

export const metadata: Metadata = {
  title: "Onboarding – IDPA Marketing-Freelancer-Plattform",
};

export default async function OnboardingPage() {
  // TODO: re-enable before go-live
  // await enforceRouteGuard("/onboarding");

  return <OnboardingForm />;
}
