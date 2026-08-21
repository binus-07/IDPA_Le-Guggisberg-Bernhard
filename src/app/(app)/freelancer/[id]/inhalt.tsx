import { PlatzhalterBild } from "@/components/platzhalter-bild";
import { Sternebewertung } from "@/components/sternebewertung";
import { FreelancerSkills } from "@/components/freelancer-skills";
import { ZurueckPfeil } from "@/components/zurueck-pfeil";
import type { Freelancer } from "@/lib/types/freelancer";

export function FreelancerDetailInhalt({ freelancer }: { freelancer: Freelancer }) {
  return (
    <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-8 px-6 pt-8 pb-24 md:px-10 lg:px-16 lg:pt-16 xl:px-[131px]">
      <div className="flex items-center gap-4 sm:gap-6">
        <ZurueckPfeil label="Zurück" />
        <h1 className="text-page-title text-foreground">Freelancer</h1>
      </div>

      <div className="flex flex-col gap-12 rounded-lg bg-card p-6 sm:p-10 lg:p-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-12">
          <PlatzhalterBild
            alt={`Portrait von ${freelancer.name}`}
            radius="image"
            src={freelancer.bildSrc}
            sizes="(min-width: 1024px) 515px, (min-width: 640px) 360px, 280px"
            priority
            className="aspect-[515/520] w-full max-w-[280px] shrink-0 sm:max-w-[360px] lg:max-w-[515px]"
          />
          <div className="flex flex-col gap-4 lg:max-w-[980px] lg:pt-2">
            <div>
              <p className="text-name-lg text-foreground">{freelancer.name}</p>
              {freelancer.seitJahren ? (
                <p className="text-body-lg text-muted-foreground">
                  {freelancer.rolle} seit {freelancer.seitJahren} Jahren
                </p>
              ) : (
                <p className="text-body-lg text-muted-foreground">{freelancer.rolle}</p>
              )}
            </div>
            {freelancer.bio ? (
              <p className="text-body-light text-foreground">{freelancer.bio}</p>
            ) : (
              <p className="text-body-light text-muted-foreground">
                Noch keine ausführliche Beschreibung hinterlegt.
              </p>
            )}
          </div>
        </div>

        <FreelancerSkills freelancer={freelancer} />

        <div className="flex flex-col gap-8">
          <h2 className="text-h2-alt text-foreground">Bisherige Projekte</h2>
          {freelancer.bisherigeProjekte && freelancer.bisherigeProjekte.length > 0 ? (
            <ul className="flex flex-col gap-10">
              {freelancer.bisherigeProjekte.map((eintrag) => (
                <li key={eintrag.titel} className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                  <PlatzhalterBild
                    alt=""
                    radius="image"
                    src={eintrag.bildSrc}
                    sizes="(min-width: 640px) 352px, 280px"
                    className="aspect-[352/212] w-full max-w-[280px] shrink-0 sm:max-w-[352px]"
                  />
                  <div className="flex flex-col gap-2">
                    <p className="text-row-title text-foreground">{eintrag.titel}</p>
                    <p className="text-body-light text-foreground">{eintrag.beschreibung}</p>
                    <p className="text-body-light text-foreground">
                      <span className="text-body">Kommentar des Auftraggebers: </span>
                      {eintrag.kommentar}
                    </p>
                    <div className="text-body flex items-center gap-2 text-foreground">
                      <span>{eintrag.datum}</span>
                      <span aria-hidden="true">·</span>
                      <Sternebewertung wert={eintrag.bewertung} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-body-light text-muted-foreground">
              Noch keine bisherigen Projekte hinterlegt.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
