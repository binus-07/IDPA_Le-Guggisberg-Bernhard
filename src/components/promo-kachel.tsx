import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlatzhalterBild } from "@/components/platzhalter-bild";
import { cn } from "@/lib/utils";

interface PromoKachelProps {
  titel: string;
  /** Screen 1: linke Kachel Anton 30px (h3), rechte Kachel Anton 40px (h2) -- so im Mockup. */
  titelRolle: "h2" | "h3";
  text: string;
  ctaHref: string;
  ctaLabel: string;
  bildAlt: string;
  /**
   * Rechte Kachel: Text/CTA oben statt unten, Bild ragt links statt rechts ueber die Karte
   * hinaus -- exakt gespiegelt, siehe Vorgabe Abschnitt 4.
   */
  spiegel?: boolean;
}

/**
 * Ab lg (1024px) ragt das Bild ueber die Kartenkante hinaus (Positionswerte aus dem Mockup
 * zurueckgerechnet: 87px vom oberen, 328px/-135px vom linken Kartenrand). Darunter (Abschnitt 10:
 * "die ueberstehenden Bilder ruecken in die Karte hinein") liegt das Bild einfach im normalen
 * Textfluss oberhalb des Textblocks.
 */
export function PromoKachel({
  titel,
  titelRolle,
  text,
  ctaHref,
  ctaLabel,
  bildAlt,
  spiegel = false,
}: PromoKachelProps) {
  return (
    <div
      className={cn(
        "relative flex w-full max-w-[625px] flex-col gap-6 rounded-lg bg-card p-8 lg:h-[828px] lg:overflow-visible",
        spiegel ? "lg:justify-start" : "lg:justify-end",
      )}
    >
      <div className="lg:hidden">
        <PlatzhalterBild
          alt={bildAlt}
          radius="image"
          className="aspect-[422/634] w-full max-w-[280px]"
        />
      </div>
      <div
        className={cn(
          "hidden lg:block lg:absolute lg:top-[87px] lg:h-[634px] lg:w-[422px]",
          spiegel ? "lg:-left-[135px]" : "lg:left-[328px]",
        )}
      >
        <PlatzhalterBild alt={bildAlt} radius="image" className="h-full w-full" />
      </div>
      <div className="relative z-[1] flex flex-col gap-4 lg:max-w-[320px]">
        <h3 className={cn("text-foreground", titelRolle === "h2" ? "text-h2" : "text-h3")}>
          {titel}
        </h3>
        <p className="text-body text-foreground">{text}</p>
        <Button asChild className="w-fit">
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      </div>
    </div>
  );
}
