import { PlatzhalterBild } from "@/components/platzhalter-bild";
import { Seitentitel } from "@/components/seitentitel";
import { TeilaufgabeZeile } from "@/components/teilaufgabe-zeile";
import type { Projekt } from "@/lib/types/projekt";

export function ProjektDetailInhalt({ projekt }: { projekt: Projekt }) {
  return (
    <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-12 px-6 pt-8 pb-24 md:px-10 lg:px-16 lg:pt-16 xl:px-[131px]">
      <Seitentitel titel="Projekte" zurueckHref="/projekte" zurueckLabel="Projekte" />

      <div className="relative h-[220px] w-full overflow-hidden rounded-lg sm:h-[320px] lg:h-[450px]">
        <PlatzhalterBild alt="" radius="card" className="absolute inset-0 h-full w-full" />
        {/* Einziger im Auftrag ausdruecklich erlaubter Verlauf (Lesbarkeit ueber dem Bild). */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background/95 to-transparent"
        />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6 sm:p-10">
          <h1 className="text-h2 text-foreground">{projekt.titel}</h1>
          <p className="text-body-lg max-w-3xl text-foreground">{projekt.auftragsbeschreibung}</p>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <h2 className="text-h2-alt text-foreground">Teilaufgaben</h2>
        <div className="flex flex-col gap-10">
          {projekt.teilaufgaben.map((teilaufgabe) => (
            <TeilaufgabeZeile key={teilaufgabe.titel} teilaufgabe={teilaufgabe} />
          ))}
        </div>
      </div>
    </div>
  );
}
