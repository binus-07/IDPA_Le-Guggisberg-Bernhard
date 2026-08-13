import { cn } from "@/lib/utils";

/**
 * Screen 4 (Teilaufgaben): Spur 484px breit / 4px hoch, Spur in Kartenflaeche (#252B36),
 * Fuellung in Weiss -- ausdruecklich NICHT im Akzent (siehe Vorgabe, Abschnitt 12).
 */
export function Fortschrittsbalken({
  prozent,
  label,
  className,
}: {
  prozent: number;
  label: string;
  className?: string;
}) {
  const geklemmt = Math.max(0, Math.min(100, prozent));

  return (
    <div
      role="progressbar"
      aria-valuenow={geklemmt}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn("h-1 w-full max-w-[484px] rounded-full bg-muted", className)}
    >
      <div className="h-full rounded-full bg-foreground" style={{ width: `${geklemmt}%` }} />
    </div>
  );
}
