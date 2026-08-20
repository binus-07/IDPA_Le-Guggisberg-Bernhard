import { FreelancerKarte } from "@/components/freelancer-karte";
import { Seitentitel } from "@/components/seitentitel";
import type { Freelancer } from "@/lib/types/freelancer";

export function FreelancerUebersichtInhalt({ freelancer }: { freelancer: Freelancer[] }) {
  return (
    <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-12 px-6 pt-8 pb-24 md:px-10 lg:px-16 lg:pt-16 xl:px-[131px]">
      <Seitentitel titel="Freelancer" />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
        {freelancer.length > 0 ? (
          freelancer.map((person) => <FreelancerKarte key={person.id} freelancer={person} />)
        ) : (
          <p className="text-body-light text-muted-foreground">Keine Freelancer gefunden.</p>
        )}
      </div>
    </div>
  );
}
