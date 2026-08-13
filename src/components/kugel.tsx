"use client";

import { useState } from "react";

/**
 * Dekorative Punktkugel oben rechts (Screen 1-4). Die Datei liegt noch nicht transparent im
 * Repo vor (siehe docs/manuelle-schritte.md) -- onError blendet sie einfach aus, statt das
 * Layout brechen zu lassen.
 */
export function Kugel() {
  const [fehler, setFehler] = useState(false);

  if (fehler) {
    return null;
  }

  // Bewusst <img> statt next/image: rein dekorativ, optional (Datei evtl. noch nicht im Repo),
  // onError-Fallback ist mit next/image wegen der erzwungenen width/height-Vorgabe unnoetig
  // kompliziert fuer diesen Anwendungsfall. ESLint warnt deshalb absichtlich weiter (kein Fehler).
  return (
    <img
      src="/sphere.webp"
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute -top-16 -right-16 z-0 h-48 w-48 object-contain select-none sm:h-64 sm:w-64 lg:-top-24 lg:-right-24 lg:h-[420px] lg:w-[420px]"
      onError={() => setFehler(true)}
    />
  );
}
