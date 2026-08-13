// TODO Phase C: durch Supabase-Abfrage ersetzen
//
// Inhalte woertlich aus dem Adobe-XD-Mockup uebernommen (siehe docs/ki-prompts.md fuer den
// vollstaendigen Prompt). Bei Lena, Selin, Dominic und Nina bricht die Beschreibung im Mockup
// mitten im Satz ab -- das ist Absicht, kein Kopierfehler: der Volltext existiert im Entwurf
// nicht. Das UI schneidet zusaetzlich per line-clamp-5 ab; die Datenlage bleibt damit ehrlich
// unvollstaendig, bis Phase C echte Texte liefert.
import type { Freelancer } from "@/lib/types/freelancer";

const FREELANCER: Freelancer[] = [
  {
    id: "hannes",
    name: "Hannes",
    rolle: "Fotograf",
    seitJahren: 12,
    beschreibung:
      "Mein Fokus liegt auf Architektur- und Immobilienfotografie klare Linien, natürliches Licht, kein Schnickschnack.",
    empfohlen: true,
  },
  {
    id: "lena",
    name: "Lena",
    rolle: "Fotografin",
    seitJahren: 8,
    beschreibung:
      "Ich bin Lena aus Zürich und spezialisiere mich auf Produkt- und E-Commerce-Fotografie. Meine Kunden schätzen saubere Bildwelten, schnelle Lieferung und einen unkomplizierten",
    empfohlen: false,
  },
  {
    id: "marco",
    name: "Marco",
    rolle: "Fotograf",
    seitJahren: 11,
    beschreibung:
      "Basler mit Tessiner Wurzeln, spezialisiert auf Corporate- und Event-Fotografie für Unternehmen aus Pharma, Finance und Tech. Ich schaffe Bildwelten, die zur Marke passen.",
    empfohlen: false,
  },
  {
    id: "selin",
    name: "Selin",
    rolle: "Fotografin",
    seitJahren: 5,
    beschreibung:
      "Ich bin Selin aus Bern und mein Fokus liegt auf People-Fotografie. Portraits, Team-Shootings und echte Emotionen. Menschen so zu zeigen wie sie wirklich sind, das ist mein",
    empfohlen: false,
  },
  {
    id: "dominic",
    name: "Dominic",
    rolle: "Fotograf",
    seitJahren: 15,
    beschreibung:
      "Food- und Gastronomiefotograf ich verstehe das Handwerk hinter gutem Essen und übersetze es ins Bild. Mehrere meiner Kunden haben seither Eingang in Restaurantguides",
    empfohlen: false,
  },
  {
    id: "nina",
    name: "Nina",
    rolle: "Fotografin",
    seitJahren: 3,
    beschreibung:
      "Ausgebildet an der Schule für Gestaltung St. Gallen, spezialisiert auf Social-Media-Content und Lifestyle-Fotografie. Ich denke von Anfang an in Formaten und liefere direkt",
    empfohlen: false,
  },
  {
    id: "thomas-wenger",
    name: "Thomas Wenger",
    rolle: "Fotograf",
    seitJahren: 22,
    beschreibung:
      "Ich arbeite seit über zwei Jahrzehnten für KMU in der Deutschschweiz — verlässlich, erfahren, ohne Agentur-Overhead. Ein starkes Bild braucht keine Erklärung.",
    bio: "Ich habe vor über zwei Jahrzehnten als Fotograf für Lokalzeitungen angefangen und seither jeden grossen Wandel der Branche hautnah miterlebt — von analog zu digital, von Print zu Social Media. Heute arbeite ich ausschliesslich als Freelancer für KMU in der Deutschschweiz, die professionelle Bildwelten brauchen, ohne eine teure Agentur dazwischenzuschalten. Mein Schwerpunkt liegt auf Unternehmens-, Produkt- und Mitarbeiterfotografie — also allem, was ein Unternehmen nach aussen sichtbar macht. Ich lege grossen Wert darauf, meine Kunden vor dem Shooting wirklich zu verstehen: ihre Branche, ihre Werte und das Bild, das sie von sich vermitteln wollen. Was mich nach all den Jahren noch immer begeistert, ist der Moment, wenn ein Kunde seine Fotos zum ersten Mal sieht und merkt, dass sie genau das zeigen, was er nie in Worte fassen konnte. Mit mir bekommt man keine austauschbaren Bilder — sondern ein visuelles Fundament, das langfristig trägt.",
    bisherigeProjekte: [
      {
        titel: "Produktshooting - Schweizer Outdoor Ausrüstung",
        beschreibung:
          "Freisteller und Lifestyle-Aufnahmen einer neuen Rucksack-Kollektion für den E-Shop und den gedruckten Katalog.",
        kommentar: "„Schnelle Abwicklung, top Qualität — buchen wir definitiv wieder.“",
        datum: "November 2025",
        bewertung: 4,
      },
      {
        titel: "Neue Website - Steuerberatungskanzlei",
        beschreibung:
          "Teamfotos und Büroaufnahmen für den kompletten Website-Relaunch einer Kanzlei mit drei Standorten in der Deutschschweiz.",
        kommentar: "„Endlich Fotos, bei denen wir selbst finden, dass wir gut aussehen.“",
        datum: "Oktober 2025",
        bewertung: 5,
      },
      {
        titel: "Jahresbericht-Fotografie - Maschinenbau-KMU",
        beschreibung:
          "Mitarbeiterportraits und Produktionsaufnahmen für den gedruckten und digitalen Jahresbericht eines Zulieferers aus dem Aargau.",
        kommentar:
          "„Professionell, pünktlich und hat Belegschaft auf Anhieb ins Herz geschlossen.“",
        datum: "Januar 2025",
        bewertung: 4,
      },
    ],
    empfohlen: false,
  },
  { id: "anna", name: "Anna", rolle: "Web Grafikerin", empfohlen: true },
  { id: "thomas-content-creator", name: "Thomas", rolle: "Content Creator", empfohlen: true },
  { id: "matthaeus", name: "Matthäus", rolle: "Videograf", empfohlen: true },
  { id: "melina", name: "Melina", rolle: "Grafikerin Print", empfohlen: true },
];

// Screen 2 (Freelancer-Auswahl): Reihenfolge exakt wie im Mockup, Karte 1 = Hannes (Stern).
const SCREEN2_IDS = ["hannes", "lena", "marco", "selin", "dominic", "nina", "thomas-wenger"];

// Home ("Top Freelancer"): eigene Reihenfolge, Hannes ist hier derselbe Datensatz wie auf
// Screen 2 (identischer Name/Rolle im Mockup -- siehe ADR 006).
const TOP_FREELANCER_IDS = ["anna", "thomas-content-creator", "hannes", "matthaeus", "melina"];

export function getFreelancer(id: string): Freelancer | undefined {
  return FREELANCER.find((freelancer) => freelancer.id === id);
}

export function getFreelancers(): Freelancer[] {
  return SCREEN2_IDS.map((id) => getFreelancer(id)!);
}

export function getTopFreelancer(): Freelancer[] {
  return TOP_FREELANCER_IDS.map((id) => getFreelancer(id)!);
}
