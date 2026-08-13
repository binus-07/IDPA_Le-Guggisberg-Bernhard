import { ProjektZeile } from "@/components/projekt-zeile";
import { Seitentitel } from "@/components/seitentitel";
import type { Projekt } from "@/lib/types/projekt";

/**
 * Im Mockup nicht gestaltet (Abschnitt 7) -- haelt sich streng an das Muster von Screen 4:
 * Seitentitel ohne Zurueck-Pfeil (Projekte ist ein eigener Navigationspunkt, kein Rueckweg
 * innerhalb eines Flows), darunter die Projekte im Zeilen-Look ohne Card-Hintergrund.
 */
export function ProjekteUebersichtInhalt({ projekte }: { projekte: Projekt[] }) {
  return (
    <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-12 px-6 pt-8 pb-24 md:px-10 lg:px-16 lg:pt-16 xl:px-[131px]">
      <Seitentitel titel="Projekte" />
      <div className="flex flex-col gap-10">
        {projekte.length > 0 ? (
          projekte.map((projekt) => <ProjektZeile key={projekt.id} projekt={projekt} />)
        ) : (
          <p className="text-body-light text-muted-foreground">Noch keine Projekte vorhanden.</p>
        )}
      </div>
    </div>
  );
}
