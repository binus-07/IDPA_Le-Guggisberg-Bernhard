// TODO Phase C: durch Supabase-Abfrage ersetzen
import type { Kategorie } from "@/lib/types/kategorie";

const KATEGORIEN: Kategorie[] = [
  { id: "videografie", name: "Videografie" },
  { id: "webprogrammierung", name: "Webprogrammierung" },
  { id: "fotografie", name: "Fotografie" },
  { id: "content-creation", name: "Content Creation" },
  { id: "print-grafik", name: "Print Grafik" },
  { id: "web-grafik", name: "Web Grafik" },
];

export function getKategorien(): Kategorie[] {
  return KATEGORIEN;
}
