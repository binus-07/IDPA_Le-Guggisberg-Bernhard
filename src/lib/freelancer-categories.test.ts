import { describe, expect, it } from "vitest";
import { kategorieFuerRolle, kategorienFuerRollen } from "./freelancer-categories";

describe("kategorieFuerRolle", () => {
  it("gruppiert Mock- und DB-Schreibweisen desselben Berufs auf dieselbe Kategorie", () => {
    expect(kategorieFuerRolle("Fotograf")).toBe("fotografie");
    expect(kategorieFuerRolle("Fotografin")).toBe("fotografie");
    expect(kategorieFuerRolle("Grafikerin Print")).toBe("print-grafik");
    expect(kategorieFuerRolle("Print-Grafiker")).toBe("print-grafik");
    expect(kategorieFuerRolle("Web Grafikerin")).toBe("web-grafik");
    expect(kategorieFuerRolle("Web-Grafiker")).toBe("web-grafik");
  });

  it("liefert null fuer unbekannte Rollenwerte statt zu crashen", () => {
    expect(kategorieFuerRolle("Illustrator")).toBeNull();
  });
});

describe("kategorienFuerRollen", () => {
  it("dedupliziert gruppierte Kategorien und sortiert nach Label", () => {
    const kategorien = kategorienFuerRollen(["Web-Grafiker", "Fotograf", "Fotografin"]);
    expect(kategorien).toEqual([
      { key: "fotografie", label: "Fotografen" },
      { key: "web-grafik", label: "Web-Grafiker" },
    ]);
  });

  it("laesst unbekannte Rollenwerte weg, ohne zu crashen", () => {
    expect(kategorienFuerRollen(["Illustrator"])).toEqual([]);
  });
});
