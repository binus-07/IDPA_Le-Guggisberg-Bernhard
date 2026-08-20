import Link from "next/link";
import { Star } from "lucide-react";
import { PlatzhalterBild } from "@/components/platzhalter-bild";
import type { Freelancer } from "@/lib/types/freelancer";

/**
 * Screen 2 (Freelancer-Auswahl): grosse Karte mit Portrait, Name/Rolle/Erfahrung nebeneinander
 * und Beschreibungstext darunter (line-clamp-5 -- manche Beschreibungen brechen im Mockup
 * bewusst mitten im Satz ab, siehe src/lib/mock/freelancer.ts). Ganze Karte ist ein Link.
 */
export function FreelancerKarte({ freelancer }: { freelancer: Freelancer }) {
  return (
    <Link
      href={`/freelancer/${freelancer.id}`}
      className="flex h-full min-w-0 flex-col gap-6 rounded-lg bg-card p-7 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div className="flex items-start gap-4">
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
        <div className="flex min-w-0 flex-col gap-1 pt-1">
          <p className="text-name text-foreground">{freelancer.name}</p>
          <p className="text-body-lg text-muted-foreground">{freelancer.rolle}</p>
          {freelancer.seitJahren ? (
            <p className="text-small text-muted-foreground">seit {freelancer.seitJahren} Jahren</p>
          ) : null}
        </div>
      </div>
      {freelancer.beschreibung ? (
        <p className="text-body-light line-clamp-5 text-foreground">{freelancer.beschreibung}</p>
      ) : null}
    </Link>
  );
}
