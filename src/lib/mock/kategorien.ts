// TODO Phase C: durch Supabase-Abfrage ersetzen
import type { Kategorie } from "@/lib/types/kategorie";

const KATEGORIEN: Kategorie[] = [
  { id: "videografie", name: "Videografie", bildSrc: "/mock/kategorie-videografie.jpg" },
  {
    id: "webprogrammierung",
    name: "Webprogrammierung",
    bildSrc: "/mock/kategorie-webprogrammierung.jpg",
  },
  { id: "fotografie", name: "Fotografie", bildSrc: "/mock/kategorie-fotografie.jpg" },
  {
    id: "content-creation",
    name: "Content Creation",
    bildSrc: "/mock/kategorie-content-creation.jpg",
  },
  { id: "print-grafik", name: "Print Grafik", bildSrc: "/mock/kategorie-print-grafik.jpg" },
  { id: "web-grafik", name: "Web Grafik", bildSrc: "/mock/kategorie-web-grafik.jpg" },
];

export function getKategorien(): Kategorie[] {
  return KATEGORIEN;
}
