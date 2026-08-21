import Link from "next/link";
import { FreelancerKarte } from "@/components/freelancer-karte";
import { Seitentitel } from "@/components/seitentitel";
import { cn } from "@/lib/utils";
import type { Freelancer } from "@/lib/types/freelancer";

function FilterPill({
  href,
  aktiv,
  children,
}: {
  href: string;
  aktiv: boolean;
  children: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-block rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        aktiv
          ? "border-primary/40 bg-primary/10 text-primary"
          : "border-border text-foreground hover:border-primary/40",
      )}
    >
      {children}
    </Link>
  );
}

export function FreelancerUebersichtInhalt({
  freelancer,
  rollen,
  aktiveRolle,
}: {
  freelancer: Freelancer[];
  rollen: string[];
  aktiveRolle: string | null;
}) {
  return (
    <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-12 px-6 pt-8 pb-24 md:px-10 lg:px-16 lg:pt-16 xl:px-[131px]">
      <Seitentitel titel="Freelancer" />

      {rollen.length > 1 && (
        <div className="flex flex-wrap gap-3">
          <FilterPill href="/freelancer" aktiv={aktiveRolle === null}>
            Alle
          </FilterPill>
          {rollen.map((rolle) => (
            <FilterPill
              key={rolle}
              href={`/freelancer?skill=${encodeURIComponent(rolle)}`}
              aktiv={aktiveRolle === rolle}
            >
              {rolle}
            </FilterPill>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {freelancer.length > 0 ? (
          freelancer.map((person) => <FreelancerKarte key={person.id} freelancer={person} />)
        ) : (
          <p className="text-body-light text-muted-foreground">Keine Freelancer gefunden.</p>
        )}
      </div>
    </div>
  );
}
