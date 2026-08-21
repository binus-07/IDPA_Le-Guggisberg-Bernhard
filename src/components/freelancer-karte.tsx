import Link from "next/link";
import { Star } from "lucide-react";
import { PlatzhalterBild } from "@/components/platzhalter-bild";
import { Sternebewertung } from "@/components/sternebewertung";
import { formatSeitJahren } from "@/lib/format";
import type { Freelancer } from "@/lib/types/freelancer";

/**
 * Bewertung fuer die Sterne-Anzeige: bevorzugt die vorberechnete DB-Spalte freelancer.rating,
 * sonst Durchschnitt der "Bisherige Projekte"-Bewertungen (Mock-Freelancer), sonst null.
 */
function bewertungFuerAnzeige(freelancer: Freelancer): number | null {
  if (freelancer.rating != null) return freelancer.rating;
  const projekte = freelancer.bisherigeProjekte;
  if (!projekte || projekte.length === 0) return null;
  return projekte.reduce((summe, projekt) => summe + projekt.bewertung, 0) / projekte.length;
}

/**
 * Screen 2 (Freelancer-Auswahl): minimalisierte Karte im Look der Home-Ansicht (siehe
 * FreelancerKarteKompakt) -- nur Portrait, Name, Rolle, Erfahrung und, falls Bewertungsdaten
 * vorliegen, die Sterne. Der ausfuehrliche Beschreibungstext bleibt der Detailseite vorbehalten,
 * die Daten dafuer (freelancer.beschreibung) werden weiterhin geladen, nur hier nicht mehr
 * angezeigt.
 */
export function FreelancerKarte({ freelancer }: { freelancer: Freelancer }) {
  const bewertung = bewertungFuerAnzeige(freelancer);

  return (
    <Link
      href={`/freelancer/${freelancer.id}`}
      className="card-hover flex h-full min-w-0 flex-col items-center gap-4 rounded-xl border border-border bg-card p-6 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div className="relative shrink-0">
        <PlatzhalterBild
          alt={`Portrait von ${freelancer.name}`}
          radius="image"
          src={freelancer.bildSrc}
          sizes="(min-width: 1024px) 182px, (min-width: 640px) 150px, 120px"
          className="size-[120px] sm:size-[150px] lg:size-[182px]"
        />
        {freelancer.empfohlen ? (
          <span className="absolute -top-2 -right-2 flex size-8 items-center justify-center rounded-full bg-background text-foreground">
            <Star aria-hidden="true" className="size-4" fill="currentColor" />
            <span className="sr-only"> (empfohlen)</span>
          </span>
        ) : null}
      </div>
      <div className="flex w-full min-w-0 flex-col items-center gap-1">
        <p className="text-name line-clamp-2 w-full text-foreground break-words">
          {freelancer.name}
        </p>
        <p className="text-body-lg line-clamp-2 w-full text-muted-foreground break-words">
          {freelancer.rolle}
        </p>
        {freelancer.seitJahren ? (
          <p className="text-small text-muted-foreground">
            {formatSeitJahren(freelancer.seitJahren)}
          </p>
        ) : null}
      </div>
      {bewertung !== null ? <Sternebewertung wert={bewertung} /> : null}
    </Link>
  );
}
