const STERN_INDIZES = [0, 1, 2, 3, 4];

/**
 * Bewertung von 0 bis 5 als fuenf Sternzeichen (gefuellt ★ / leer ☆). Die Sternzeichen selbst
 * sind aria-hidden, das umschliessende Element traegt das aussagekraeftige aria-label -- siehe
 * Abschnitt 6/11 der Vorgabe.
 */
export function Sternebewertung({ wert }: { wert: number }) {
  const geklemmt = Math.max(0, Math.min(5, Math.round(wert)));

  return (
    <span role="img" aria-label={`${geklemmt} von 5 Sternen`} className="text-foreground">
      {STERN_INDIZES.map((index) => (
        <span key={index} aria-hidden="true">
          {index < geklemmt ? "★" : "☆"}
        </span>
      ))}
    </span>
  );
}
