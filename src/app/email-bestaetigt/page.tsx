import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { enforceRouteGuard } from "@/lib/auth/server-guard";

export const metadata: Metadata = {
  title: "E-Mail bestätigt – IDPA Marketing-Freelancer-Plattform",
};

export default async function EmailBestaeligtPage() {
  await enforceRouteGuard("/email-bestaetigt");

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-heading text-2xl">E-Mail bestätigt</CardTitle>
          <CardDescription>
            Deine E-Mail-Adresse wurde erfolgreich bestätigt. Richte jetzt dein Profil ein, um
            loszulegen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/onboarding">Profil einrichten</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
