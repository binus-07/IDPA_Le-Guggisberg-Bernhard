import Link from "next/link";
import { PlatzhalterBild } from "@/components/platzhalter-bild";
import type { Projekt } from "@/lib/types/projekt";

/**
 * /projekte (Uebersicht, im Mockup nicht gestaltet -- Abschnitt 7). Haelt sich streng an das
 * Zeilen-Muster von Screen 4 (Bild links, kein Card-Hintergrund), zeigt aber Projekt- statt
 * Teilaufgaben-Metadaten: Betrag/Frist/Freelancer gibt es nur pro Teilaufgabe, nicht pro Projekt.
 */
export function ProjektZeile({ projekt }: { projekt: Projekt }) {
  return (
    <Link
      href={`/projekte/${projekt.id}`}
      className="flex flex-col gap-4 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:flex-row sm:gap-6"
    >
      <PlatzhalterBild
        alt=""
        radius="image"
        src={projekt.bildSrc}
        sizes="(min-width: 640px) 352px, 280px"
        className="aspect-[352/218] w-full max-w-[280px] shrink-0 sm:max-w-[352px]"
      />
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-3">
        <p className="text-row-title text-foreground">{projekt.titel}</p>
        <p className="text-body-light line-clamp-2 text-foreground">
          {projekt.auftragsbeschreibung}
        </p>
      </div>
    </Link>
  );
}
