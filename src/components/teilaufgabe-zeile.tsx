import { Fortschrittsbalken } from "@/components/fortschrittsbalken";
import { PlatzhalterBild } from "@/components/platzhalter-bild";
import { formatChf } from "@/lib/format";
import type { Teilaufgabe } from "@/lib/types/projekt";

/**
 * Screen 4 (Teilaufgaben) und -- laut Abschnitt 9 -- das noch nicht gestaltete
 * Freelancer-Dashboard ("offene Anfragen"). Ohne eigene Kartenflaeche: die Eintraege liegen im
 * Mockup direkt auf dem Seitenhintergrund.
 */
export function TeilaufgabeZeile({ teilaufgabe }: { teilaufgabe: Teilaufgabe }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
      <PlatzhalterBild
        alt=""
        radius="image"
        className="aspect-[352/218] w-full max-w-[280px] shrink-0 sm:max-w-[352px]"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <p className="text-row-title flex-1 basis-full text-foreground sm:basis-auto">
            {teilaufgabe.titel}
          </p>
          <div className="w-full sm:w-[484px]">
            <Fortschrittsbalken
              prozent={teilaufgabe.fortschrittProzent}
              label={`Fortschritt: ${teilaufgabe.fortschrittProzent} %`}
            />
          </div>
        </div>
        {(teilaufgabe.freelancerName || teilaufgabe.freelancerRolle || teilaufgabe.betragChf != null || teilaufgabe.frist) ? (
          <p className="text-body text-foreground">
            {[teilaufgabe.freelancerName, teilaufgabe.freelancerRolle].filter(Boolean).join(" ")}
            {teilaufgabe.betragChf != null && <><span aria-hidden="true"> • </span>{formatChf(teilaufgabe.betragChf)}</>}
            {teilaufgabe.frist && <><span aria-hidden="true"> • </span>Bis {teilaufgabe.frist}</>}
          </p>
        ) : (
          <p className="text-body text-muted-foreground">Noch kein Freelancer zugewiesen</p>
        )}
        {teilaufgabe.letzteNachricht && (
          <p className="text-body text-foreground">
            Letzte Nachricht: &bdquo;{teilaufgabe.letzteNachricht}&ldquo;
          </p>
        )}
      </div>
    </div>
  );
}
