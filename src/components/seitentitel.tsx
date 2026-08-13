import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * Screens 3 und 4: Zurueck-Pfeil plus Titel, Inter Black 50px. Ohne zurueckHref nur der Titel
 * (z. B. /projekte als Uebersicht, die kein Zurueck-Ziel hat).
 */
export function Seitentitel({
  titel,
  zurueckHref,
  zurueckLabel,
}: {
  titel: string;
  zurueckHref?: string;
  zurueckLabel?: string;
}) {
  return (
    <div className="flex items-center gap-4 sm:gap-6">
      {zurueckHref ? (
        <Link
          href={zurueckHref}
          aria-label={zurueckLabel ? `Zurueck zu ${zurueckLabel}` : "Zurueck"}
          className="flex items-center text-foreground focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <ArrowLeft aria-hidden="true" className="size-[32px] sm:size-[38px]" />
        </Link>
      ) : null}
      <h1 className="text-page-title text-foreground">{titel}</h1>
    </div>
  );
}
