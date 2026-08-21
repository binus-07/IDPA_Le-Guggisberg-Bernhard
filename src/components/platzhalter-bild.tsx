import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Zeigt eine farbige Flaeche (gedaempfte Mockup-Farbe), solange kein `src` uebergeben wird --
 * fuer Bildflaechen, die noch kein lizenzfreies Bild aus public/mock/ haben (siehe
 * docs/manuelle-schritte.md, docs/bildquellen.md). Mit `src` rendert dieselbe Komponente ein
 * echtes next/image mit object-cover, damit Radius/Alt/Aria-Handling an einer Stelle bleiben statt
 * an jeder der ~10 Call-Sites dupliziert zu werden.
 * Radius ist bei den meisten Bildern 40px (--radius-image), beim Projekt-Banner (Screen 4)
 * ausnahmsweise 8px (--radius, Karten-Radius) -- siehe Vorgabe.
 */
export function PlatzhalterBild({
  alt,
  radius = "image",
  className,
  src,
  sizes,
  priority,
}: {
  alt: string;
  radius?: "image" | "card";
  className?: string;
  src?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const dekorativ = alt === "";
  const radiusClass = radius === "image" ? "rounded-image" : "rounded-lg";

  if (!src) {
    return (
      <div
        role={dekorativ ? undefined : "img"}
        aria-label={dekorativ ? undefined : alt}
        aria-hidden={dekorativ ? "true" : undefined}
        className={cn("bg-muted-foreground", radiusClass, className)}
      />
    );
  }

  return (
    <div className={cn("relative overflow-hidden", radiusClass, className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes ?? "100vw"}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}
