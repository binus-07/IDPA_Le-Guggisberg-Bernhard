import Link from "next/link";
import { PlatzhalterBild } from "@/components/platzhalter-bild";
import { cn } from "@/lib/utils";

const FOKUS =
  "focus-visible:rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/**
 * Generische Bild-oben/Beschriftung-unten-Karte (Kategorien auf Screen 1, spaeter "Meine
 * Projekte" im Freelancer-Dashboard -- selbes Raster, andere Inhalte/Linkziele). Lange
 * Beschriftungen bekommen automatisch eine kleinere Schrift statt eines Sonderfalls pro Name
 * (>17 Zeichen -> 25px, >13 Zeichen -> 28px, sonst 30px -- trifft mit den 6 Kategorienamen exakt
 * die im Mockup gemessenen Werte).
 */
function labelGroesse(label: string): string {
  if (label.length > 17) return "text-[25px]";
  if (label.length > 13) return "text-[28px]";
  return "text-[30px]";
}

export function BildKarte({
  label,
  href,
  bildAlt,
}: {
  label: string;
  href?: string;
  bildAlt: string;
}) {
  const inhalt = (
    <div className="flex h-full flex-col gap-3">
      <PlatzhalterBild alt={bildAlt} radius="image" className="aspect-[252/354] w-full" />
      <p className={cn("font-sans font-normal text-foreground text-center", labelGroesse(label))}>
        {label}
      </p>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className={cn("block h-full", FOKUS)}>
        {inhalt}
      </Link>
    );
  }

  return inhalt;
}
