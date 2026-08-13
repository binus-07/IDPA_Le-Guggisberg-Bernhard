import { BildKarte } from "@/components/bild-karte";
import { TeilaufgabeZeile } from "@/components/teilaufgabe-zeile";
import type { Projekt, Teilaufgabe } from "@/lib/types/projekt";

/**
 * Im Mockup nicht gestaltet (Abschnitt 9). Spiegelbild von Screen 1 aus Freelancer-Sicht: Hero
 * mit Anrede, offene Anfragen im Teilaufgaben-Look von Screen 4, "Meine Projekte" im
 * Kategorien-Raster. Keine Promo-Kacheln -- ergeben fuer Freelancer keinen Sinn.
 */
export function FreelancerDashboardInhalt({
  offeneAnfragen,
  projekte,
}: {
  offeneAnfragen: Teilaufgabe[];
  projekte: Projekt[];
}) {
  return (
    <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-24 px-6 pt-8 pb-24 md:px-10 lg:px-16 lg:pt-16 xl:px-[131px]">
      <section className="flex flex-col gap-8">
        <h1 className="text-display text-foreground">Willkommen zurück</h1>
        <p className="text-lead max-w-xl text-foreground">
          Hier sind deine offenen Anfragen und laufenden Projekte.
        </p>
      </section>

      <section className="flex flex-col gap-8">
        <h2 className="text-section-label text-foreground">Offene Anfragen</h2>
        {offeneAnfragen.length > 0 ? (
          <div className="flex flex-col gap-10">
            {offeneAnfragen.map((anfrage) => (
              <TeilaufgabeZeile key={anfrage.titel} teilaufgabe={anfrage} />
            ))}
          </div>
        ) : (
          <p className="text-body-light text-muted-foreground">Aktuell keine offenen Anfragen.</p>
        )}
      </section>

      <section className="flex flex-col gap-8">
        <h2 className="text-section-label text-foreground">Meine Projekte</h2>
        {projekte.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {projekte.map((projekt) => (
              <BildKarte
                key={projekt.id}
                label={projekt.titel}
                bildAlt=""
                href={`/projekte/${projekt.id}`}
              />
            ))}
          </div>
        ) : (
          <p className="text-body-light text-muted-foreground">Noch keine Projekte.</p>
        )}
      </section>
    </div>
  );
}
