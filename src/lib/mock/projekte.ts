// TODO Phase C: durch Supabase-Abfrage ersetzen
//
// Inhalte woertlich aus dem Adobe-XD-Mockup uebernommen (siehe docs/ki-prompts.md). Betraege als
// number gespeichert, Formatierung (CHF-Praefix, Schweizer Tausendertrennzeichen mit U+2019) passiert
// beim Rendern (src/app/(app)/projekte/[id]/page.tsx), nicht in den Daten.
import type { Projekt } from "@/lib/types/projekt";

const PROJEKTE: Projekt[] = [
  {
    id: "brack-alltron",
    titel: "Brack.alltron Mitarbeiter Plattform erstellen",
    auftragsbeschreibung:
      "Auftrag: Eine Webseite für die Brack.Alltron Mitarbeiter wo interne Nachrichten wie auch ein digitales Telefonbuch geführt wird für welches neue Fotos von den Mitarbeiter braucht.",
    teilaufgaben: [
      {
        titel: "Webseite erstellen",
        fortschrittProzent: 41,
        freelancerName: "Lukas",
        freelancerRolle: "Webprogramierer",
        betragChf: 4000,
        frist: "24. November 2026",
        letzteNachricht: "Ich habe jetzt die Domain lizensiert, hier ist die Rechnung",
      },
      {
        titel: "Mitarbeiter fotografiern",
        fortschrittProzent: 87,
        freelancerName: "Hannes",
        freelancerRolle: "Fotograf",
        betragChf: 1500,
        frist: "24. November 2026",
        letzteNachricht: "Ich habe die Fotos ausgewertet und werde sie jetzt final bearbeiten",
      },
      {
        titel: "Mockup designen",
        fortschrittProzent: 100,
        freelancerName: "Thomas",
        freelancerRolle: "Web Designer",
        betragChf: 1800,
        frist: "20. August 2026",
        letzteNachricht:
          "Schön das Ihnen das Mockup so gefällt, ich leite es weiter an Lukas für die Umsetzung",
      },
    ],
  },
];

export function getProjekt(id: string): Projekt | undefined {
  return PROJEKTE.find((projekt) => projekt.id === id);
}

export function getProjekte(): Projekt[] {
  return PROJEKTE;
}
