import type { ReactNode } from "react";
import { Kugel } from "@/components/kugel";

// Kein AppShell (nicht eingeloggt), aber die dekorative Kugel oben rechts bleibt laut Abschnitt 9
// erhalten. Kugel steht vor "children" im Markup, damit der Seiteninhalt beim Ueberlappen
// automatisch obenauf liegt (gleiches Muster wie im AppShell).
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex flex-1 flex-col">
      <Kugel />
      {children}
    </div>
  );
}
