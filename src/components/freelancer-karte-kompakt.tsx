import Link from "next/link";
import { Star } from "lucide-react";
import { PlatzhalterBild } from "@/components/platzhalter-bild";
import type { Freelancer } from "@/lib/types/freelancer";

/**
 * "Top Freelancer" auf Screen 1: Portrait, sternfoermiges Abzeichen bei empfohlen:true (ragt
 * ueber die Bildkante), Name, Rolle. Ganze Karte ist ein Link auf /freelancer/[id]. Der Akzent
 * ist fuer Badges tabu (Abschnitt 1) -- das Abzeichen ist deshalb weiss auf Kartenflaeche.
 */
export function FreelancerKarteKompakt({ freelancer }: { freelancer: Freelancer }) {
  return (
    <Link
      href={`/freelancer/${freelancer.id}`}
      className="flex min-w-0 flex-col gap-3 focus-visible:rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div className="relative">
        <PlatzhalterBild
          alt={`Portrait von ${freelancer.name}`}
          radius="image"
          className="aspect-[252/265] w-full"
        />
        {freelancer.empfohlen ? (
          <span className="absolute -top-3 -right-3 flex size-9 items-center justify-center rounded-full bg-card text-foreground">
            <Star aria-hidden="true" className="size-4" fill="currentColor" />
            <span className="sr-only"> (empfohlen)</span>
          </span>
        ) : null}
      </div>
      <div>
        <p className="text-name text-foreground">{freelancer.name}</p>
        <p className="text-body-lg text-muted-foreground">{freelancer.rolle}</p>
      </div>
    </Link>
  );
}
