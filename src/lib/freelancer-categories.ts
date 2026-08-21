/**
 * Gruppiert die tatsaechlichen `rolle`-Werte (Mock-Daten + `public.freelancer`, siehe
 * data/Freelancer_Datenbank_Freelancer.csv Spalte "Freelancer-Tätigkeit") zu Kategorien fuer den
 * Freelancer-Uebersichts-Filter. Mock- und DB-Daten verwenden fuer denselben Beruf teils
 * unterschiedliche Schreibweisen (z. B. "Grafikerin Print" vs. "Print-Grafiker", "Web Grafikerin"
 * vs. "Web-Grafiker") -- ohne dieses Mapping würden das zwei separate Filter-Buttons fuer
 * denselben Beruf ergeben.
 *
 * Unbekannte `rolle`-Werte bekommen bewusst keinen eigenen Filter-Button (siehe
 * `kategorieFuerRollen`), erscheinen aber weiterhin unter "Alle" -- kein Freelancer verschwindet
 * wegen eines nicht gemappten Rollenwerts.
 */
export const ROLLE_ZU_KATEGORIE: Record<string, string> = {
  Fotograf: "fotografie",
  Fotografin: "fotografie",
  Videograf: "videografie",
  Videografin: "videografie",
  Webprogrammierer: "webprogrammierung",
  Webprogrammiererin: "webprogrammierung",
  "Web Grafikerin": "web-grafik",
  "Web-Grafiker": "web-grafik",
  "Web-Grafikerin": "web-grafik",
  "Grafikerin Print": "print-grafik",
  "Print-Grafiker": "print-grafik",
  "Print-Grafikerin": "print-grafik",
  "Content Creator": "content-creation",
};

export const KATEGORIE_LABELS: Record<string, string> = {
  fotografie: "Fotografen",
  videografie: "Videografen",
  webprogrammierung: "Web-Programmierer",
  "web-grafik": "Web-Grafiker",
  "print-grafik": "Print-Grafiker",
  "content-creation": "Content Creator",
};

export function kategorieFuerRolle(rolle: string): string | null {
  return ROLLE_ZU_KATEGORIE[rolle] ?? null;
}

/** Distinct Kategorien (mit mind. einem Freelancer), sortiert nach Label. */
export function kategorienFuerRollen(rollen: string[]): { key: string; label: string }[] {
  const keys = new Set(rollen.map(kategorieFuerRolle).filter((k): k is string => k !== null));
  return [...keys]
    .map((key) => ({ key, label: KATEGORIE_LABELS[key] }))
    .sort((a, b) => a.label.localeCompare(b.label, "de"));
}
