import type { Metadata } from "next";
import { AnmeldenForm } from "./anmelden-form";

export const metadata: Metadata = {
  title: "Anmelden – IDPA Marketing-Freelancer-Plattform",
};

// Fehlercodes, die als ?fehler=... in der URL ankommen (z. B. von src/app/auth/confirm/route.ts
// bei einem abgelaufenen/ungueltigen Bestaetigungs- oder Reset-Link).
const URL_FEHLER: Record<string, string> = {
  "link-ungueltig":
    "Der Link ist ungültig oder abgelaufen. Bitte erneut registrieren oder anmelden.",
};

export default async function AnmeldenPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; fehler?: string }>;
}) {
  const { redirect: redirectTo, fehler } = await searchParams;
  const initialError = fehler ? (URL_FEHLER[fehler] ?? undefined) : undefined;

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <AnmeldenForm redirectTo={redirectTo ?? ""} initialError={initialError} />
    </main>
  );
}
