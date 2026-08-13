import { cn } from "@/lib/utils";

/**
 * Steht fuer ein echtes Bild ein, solange keine lizenzfreien Bilder vorliegen (siehe
 * docs/manuelle-schritte.md). Farbige Flaeche in der gedaempften Farbe statt externer Bild-URLs.
 * Radius ist bei den meisten Bildern 40px (--radius-image), beim Projekt-Banner (Screen 4)
 * ausnahmsweise 8px (--radius, Karten-Radius) -- siehe Vorgabe.
 */
export function PlatzhalterBild({
  alt,
  radius = "image",
  className,
}: {
  alt: string;
  radius?: "image" | "card";
  className?: string;
}) {
  const dekorativ = alt === "";

  return (
    <div
      role={dekorativ ? undefined : "img"}
      aria-label={dekorativ ? undefined : alt}
      aria-hidden={dekorativ ? "true" : undefined}
      className={cn(
        "bg-muted-foreground",
        radius === "image" ? "rounded-image" : "rounded-lg",
        className,
      )}
    />
  );
}
