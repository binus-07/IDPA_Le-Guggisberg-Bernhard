import { FreelancerKarte } from "@/components/freelancer-karte";
import type { Freelancer } from "@/lib/types/freelancer";

export function MarketingPlanungInhalt({ freelancer }: { freelancer: Freelancer[] }) {
  return (
    <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-12 px-6 pt-8 pb-24 md:px-10 lg:px-16 lg:pt-16 xl:px-[131px]">
      <div className="flex flex-col gap-6">
        <h1 className="text-display text-foreground">Wählen Sie einen passenden Freelancer aus</h1>
        <p className="text-lead max-w-3xl text-foreground">
          Für ihr Produkt haben wir folgenden Plan und der eine Teil braucht dafür Bilder darum such
          dir hier einen Fotograf:in Freelancer aus welche:r Ihnen passt.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
        {freelancer.map((person) => (
          <FreelancerKarte key={person.id} freelancer={person} />
        ))}
      </div>
    </div>
  );
}
