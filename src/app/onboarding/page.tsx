import type { Metadata } from "next";
import { enforceRouteGuard } from "@/lib/auth/server-guard";
import { OnboardingForm } from "./onboarding-form";

export const metadata: Metadata = {
  title: "Onboarding – IDPA Marketing-Freelancer-Plattform",
};

export default async function OnboardingPage() {
  await enforceRouteGuard("/onboarding");

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <OnboardingForm />
    </main>
  );
}
