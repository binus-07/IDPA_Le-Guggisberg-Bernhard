import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getFreelancers } from "@/lib/mock/freelancer";
import { kategorienFuerRollen } from "@/lib/freelancer-categories";
import { FreelancerUebersichtInhalt } from "./inhalt";

describe("FreelancerUebersichtInhalt", () => {
  it("zeigt Titel, Untertitel und alle Freelancer-Karten", () => {
    const freelancer = getFreelancers();
    const kategorien = kategorienFuerRollen(freelancer.map((f) => f.rolle));
    render(
      <FreelancerUebersichtInhalt
        freelancer={freelancer}
        kategorien={kategorien}
        aktiveKategorie={null}
        fehler={false}
      />,
    );

    expect(screen.getByRole("heading", { name: "Unsere Freelancer" })).toBeInTheDocument();
    expect(
      screen.getByText("Entdecke unsere Experten in verschiedensten Disziplinen"),
    ).toBeInTheDocument();

    const link = screen.getByRole("link", { name: new RegExp(freelancer[0].name) });
    expect(link).toHaveAttribute("href", `/freelancer/${freelancer[0].id}`);
  });

  it("blendet die Filterzeile aus, wenn nur eine Kategorie vorkommt (z. B. getFreelancers() -- nur Fotograf/Fotografin)", () => {
    const freelancer = getFreelancers();
    const kategorien = kategorienFuerRollen(freelancer.map((f) => f.rolle));
    expect(kategorien).toHaveLength(1);

    render(
      <FreelancerUebersichtInhalt
        freelancer={freelancer}
        kategorien={kategorien}
        aktiveKategorie={null}
        fehler={false}
      />,
    );

    expect(screen.queryByRole("link", { name: "Alle" })).not.toBeInTheDocument();
  });

  it("verlinkt 'Alle' und jede Kategorie als Filter-Pill mit ?category=-Parameter und markiert die aktive Kategorie", () => {
    render(
      <FreelancerUebersichtInhalt
        freelancer={[]}
        kategorien={[
          { key: "fotografie", label: "Fotografen" },
          { key: "web-grafik", label: "Web-Grafiker" },
        ]}
        aktiveKategorie="fotografie"
        fehler={false}
      />,
    );

    const alleFilter = screen.getByRole("link", { name: "Alle" });
    expect(alleFilter).toHaveAttribute("href", "/freelancer");
    expect(alleFilter).not.toHaveAttribute("aria-current");

    const fotografenFilter = screen.getByRole("link", { name: "Fotografen" });
    expect(fotografenFilter).toHaveAttribute("href", "/freelancer?category=fotografie");
    expect(fotografenFilter).toHaveAttribute("aria-current", "page");

    const webFilter = screen.getByRole("link", { name: "Web-Grafiker" });
    expect(webFilter).toHaveAttribute("href", "/freelancer?category=web-grafik");
    expect(webFilter).not.toHaveAttribute("aria-current");
  });

  it("zeigt einen kategoriespezifischen leeren Zustand", () => {
    render(
      <FreelancerUebersichtInhalt
        freelancer={[]}
        kategorien={[{ key: "fotografie", label: "Fotografen" }]}
        aktiveKategorie="fotografie"
        fehler={false}
      />,
    );

    expect(
      screen.getByText("Für diese Kategorie sind aktuell keine Freelancer vorhanden."),
    ).toBeInTheDocument();
  });

  it("zeigt einen Fehlerzustand statt eines leeren Zustands, wenn das Laden fehlschlug", () => {
    render(
      <FreelancerUebersichtInhalt freelancer={[]} kategorien={[]} aktiveKategorie={null} fehler />,
    );

    expect(
      screen.getByText("Freelancer konnten nicht geladen werden. Bitte versuche es später erneut."),
    ).toBeInTheDocument();
    expect(screen.queryByText("Keine Freelancer gefunden.")).not.toBeInTheDocument();
  });
});
