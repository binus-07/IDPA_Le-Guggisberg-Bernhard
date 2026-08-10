import type { Metadata } from "next";
import { LogoutButton } from "@/components/logout-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { enforceRouteGuard } from "@/lib/auth/server-guard";

export const metadata: Metadata = {
  title: "Dashboard – Unternehmen",
};

export default async function UnternehmenDashboardPage() {
  const { user } = await enforceRouteGuard("/dashboard/unternehmen");

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-heading text-2xl">
            Willkommen{user?.email ? `, ${user.email}` : ""}
          </CardTitle>
          <CardDescription>Rolle: Unternehmen</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Freelancer-Suche, Briefing-Erstellung und Vergleichsfunktion kommen in Phase C/D.
          </p>
          <LogoutButton />
        </CardContent>
      </Card>
    </main>
  );
}
