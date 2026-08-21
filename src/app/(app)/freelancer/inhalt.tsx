import Link from "next/link";
import { FreelancerKarte } from "@/components/freelancer-karte";
import { cn } from "@/lib/utils";
import type { Freelancer } from "@/lib/types/freelancer";

function FilterPill({ href, aktiv, children }: { href: string; aktiv: boolean; children: string }) {
  return (
    <Link
      href={href}
      aria-current={aktiv ? "page" : undefined}
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
  kategorien,
  aktiveKategorie,
  fehler,
}: {
  freelancer: Freelancer[];
  kategorien: { key: string; label: string }[];
  aktiveKategorie: string | null;
  fehler: boolean;
}) {
  return (
    <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-12 px-6 pt-8 pb-24 md:px-10 lg:px-16 lg:pt-16 xl:px-[131px]">
      <div className="flex flex-col gap-2">
        <h1 className="text-page-title text-foreground">Unsere Freelancer</h1>
        <p className="text-body-lg text-muted-foreground">
          Entdecke unsere Experten in verschiedensten Disziplinen
        </p>
      </div>

      {kategorien.length > 1 && (
        <div className="flex flex-wrap gap-3">
          <FilterPill href="/freelancer" aktiv={aktiveKategorie === null}>
            Alle
          </FilterPill>
          {kategorien.map((kategorie) => (
            <FilterPill
              key={kategorie.key}
              href={`/freelancer?category=${encodeURIComponent(kategorie.key)}`}
              aktiv={aktiveKategorie === kategorie.key}
            >
              {kategorie.label}
            </FilterPill>
          ))}
        </div>
      )}

      {fehler ? (
        <p className="text-body-light text-muted-foreground">
          Freelancer konnten nicht geladen werden. Bitte versuche es später erneut.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {freelancer.length > 0 ? (
            freelancer.map((person) => <FreelancerKarte key={person.id} freelancer={person} />)
          ) : (
            <p className="text-body-light text-muted-foreground">
              {aktiveKategorie
                ? "Für diese Kategorie sind aktuell keine Freelancer vorhanden."
                : "Keine Freelancer gefunden."}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
