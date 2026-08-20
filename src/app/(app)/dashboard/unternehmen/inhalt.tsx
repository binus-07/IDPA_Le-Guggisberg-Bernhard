import { BildKarte } from "@/components/bild-karte";
import { FreelancerKarteKompakt } from "@/components/freelancer-karte-kompakt";
import { PromoKachel } from "@/components/promo-kachel";
import { UnternehmenDashboardStats } from "@/components/unternehmen-dashboard-stats";
import type { Freelancer } from "@/lib/types/freelancer";
import type { Kategorie } from "@/lib/types/kategorie";
import type { Projekt } from "@/lib/types/projekt";

/**
 * Vom Server-Guard in page.tsx getrennt, damit sich der eigentliche Seiteninhalt ohne
 * Supabase-/Cookie-Mocking rendern und testen laesst (siehe inhalt.test.tsx).
 */
export function UnternehmenDashboardInhalt({
  kategorien,
  topFreelancer,
  projekte,
}: {
  kategorien: Kategorie[];
  topFreelancer: Freelancer[];
  projekte: Projekt[];
}) {
  return (
    <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-24 px-6 pt-8 pb-24 md:px-10 lg:px-16 lg:pt-16 xl:px-[131px]">
      <section className="flex flex-col gap-8">
        <h1 className="text-display leading-[1.49] text-foreground">
          <span className="block">Ihr Marketing</span>
          <span className="block">Effizient gestalten</span>
        </h1>
        <p className="text-lead max-w-xl text-muted-foreground">In wenigen Schritten zur Lösung</p>
      </section>

      <UnternehmenDashboardStats projekte={projekte} topFreelancer={topFreelancer} />

      <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <PromoKachel
          titel="Produkt Promoten"
          titelRolle="h3"
          text="Produkt in der Praxis vermarkten"
          ctaHref="/marketing-planung"
          ctaLabel="Plan erstellen"
          bildAlt=""
          bildSrc="/mock/promo-produkt.jpg"
          spiegel={false}
        />
        <PromoKachel
          titel="Marke Promoten"
          titelRolle="h2"
          text="Gestalte wie der Markt deine Marke sieht"
          ctaHref="/marketing-planung"
          ctaLabel="Plan erstellen"
          bildAlt=""
          bildSrc="/mock/promo-marke.jpg"
          spiegel
        />
      </section>

      <section className="flex flex-col gap-8">
        <h2 className="text-h2 text-foreground">Freelancer-Kategorien</h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
          {kategorien.map((kategorie) => (
            <BildKarte
              key={kategorie.id}
              label={kategorie.name}
              bildAlt=""
              bildSrc={kategorie.bildSrc}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-8">
        <h2 className="text-h2 text-foreground">Top Freelancer</h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
          {topFreelancer.map((freelancer) => (
            <FreelancerKarteKompakt key={freelancer.id} freelancer={freelancer} />
          ))}
        </div>
      </section>
    </div>
  );
}
