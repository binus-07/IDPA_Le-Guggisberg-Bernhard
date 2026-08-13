import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getProjekte } from "@/lib/mock/projekte";
import { FreelancerDashboardInhalt } from "./inhalt";

describe("FreelancerDashboardInhalt", () => {
  it("zeigt Hero, offene Anfragen und Meine Projekte mit Verlinkung", () => {
    const projekte = getProjekte();
    const offeneAnfragen = projekte.flatMap((projekt) => projekt.teilaufgaben);

    render(<FreelancerDashboardInhalt offeneAnfragen={offeneAnfragen} projekte={projekte} />);

    expect(screen.getByRole("heading", { name: "Willkommen zurück" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Offene Anfragen" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Meine Projekte" })).toBeInTheDocument();

    expect(screen.getAllByRole("progressbar")).toHaveLength(offeneAnfragen.length);

    const projektLink = screen.getByRole("link", { name: projekte[0].titel });
    expect(projektLink).toHaveAttribute("href", `/projekte/${projekte[0].id}`);
  });

  it("zeigt leere Zustaende ohne Anfragen und Projekte", () => {
    render(<FreelancerDashboardInhalt offeneAnfragen={[]} projekte={[]} />);

    expect(screen.getByText("Aktuell keine offenen Anfragen.")).toBeInTheDocument();
    expect(screen.getByText("Noch keine Projekte.")).toBeInTheDocument();
  });
});
