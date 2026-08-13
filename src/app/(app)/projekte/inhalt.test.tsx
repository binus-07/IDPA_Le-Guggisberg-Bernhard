import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getProjekte } from "@/lib/mock/projekte";
import { ProjekteUebersichtInhalt } from "./inhalt";

describe("ProjekteUebersichtInhalt", () => {
  it("zeigt den Seitentitel ohne Zurueck-Pfeil und verlinkt jedes Projekt", () => {
    const projekte = getProjekte();
    render(<ProjekteUebersichtInhalt projekte={projekte} />);

    expect(screen.getByRole("heading", { name: "Projekte" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Zurueck/ })).not.toBeInTheDocument();

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(projekte.length);
    projekte.forEach((projekt) => {
      const link = screen.getByRole("link", { name: new RegExp(projekt.titel) });
      expect(link).toHaveAttribute("href", `/projekte/${projekt.id}`);
    });
  });

  it("zeigt einen leeren Zustand ohne Projekte", () => {
    render(<ProjekteUebersichtInhalt projekte={[]} />);

    expect(screen.getByText("Noch keine Projekte vorhanden.")).toBeInTheDocument();
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });
});
