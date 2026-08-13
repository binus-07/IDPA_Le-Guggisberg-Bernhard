import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlatzhalterBild } from "@/components/platzhalter-bild";

interface PromoKachelProps {
  titel: string;
  titelRolle: "h2" | "h3";
  text: string;
  ctaHref: string;
  ctaLabel: string;
  bildAlt: string;
  spiegel?: boolean;
}

export function PromoKachel({
  titel,
  titelRolle,
  text,
  ctaHref,
  ctaLabel,
  bildAlt,
}: PromoKachelProps) {
  return (
    <div className="card-hover flex flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative h-64 w-full">
        <PlatzhalterBild
          alt={bildAlt}
          radius="card"
          className="absolute inset-0 h-full w-full"
        />
      </div>
      <div className="flex flex-grow flex-col justify-between p-8">
        <div>
          <h3 className={`mb-4 text-foreground ${titelRolle === "h2" ? "text-h2" : "text-h3"}`}>
            {titel}
          </h3>
          <p className="text-body mb-8 text-muted-foreground">{text}</p>
        </div>
        <Button asChild className="w-fit">
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      </div>
    </div>
  );
}
