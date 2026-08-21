/**
 * Schweizer Tausendertrennzeichen mit typografischem Hochkomma (U+2019), nicht dem geraden
 * Apostroph -- siehe Vorgabe zu Screen 4. de-CH liefert das Zeichen bereits per ICU, die
 * Normalisierung ist nur eine Absicherung gegen abweichende ICU-Daten der Laufzeitumgebung.
 */
export function formatChf(betrag: number): string {
  const formatiert = new Intl.NumberFormat("de-CH").format(betrag);
  // Punkt, Komma, gerades Apostroph, geschuetztes und schmales geschuetztes Leerzeichen als
  // moegliche Gruppierungszeichen alternativer ICU-Daten auf U+2019 normalisieren.
  const normalisiert = formatiert.replace(/[.,'  ]/g, "’");
  return `CHF ${normalisiert}`;
}

/** "seit 1 Jahr" (Singular) vs. "seit 2+ Jahren" (Plural) -- kein "seit 1 Jahren". */
export function formatSeitJahren(jahre: number): string {
  return `seit ${jahre} ${jahre === 1 ? "Jahr" : "Jahren"}`;
}
