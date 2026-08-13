import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getFreelancer } from "@/lib/mock/freelancer";
import { FreelancerDetailInhalt } from "./inhalt";

describe("FreelancerDetailInhalt", () => {
  it("zeigt Name, Bio und alle 3 bisherigen Projekte von Thomas Wenger", () => {
    const thomas = getFreelancer("thomas-wenger")!;
    render(<FreelancerDetailInhalt freelancer={thomas} />);

    expect(screen.getByText("Thomas Wenger")).toBeInTheDocument();
    expect(screen.getByText("Fotograf seit 22 Jahren")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Bisherige Projekte" })).toBeInTheDocument();

    const eintraege = screen.getAllByRole("listitem");
    expect(eintraege).toHaveLength(3);

    expect(screen.getByText("Produktshooting - Schweizer Outdoor Ausrüstung")).toBeInTheDocument();
    // Eintrag 1 und 3 sind beide mit 4 von 5 Sternen bewertet, Eintrag 2 mit 5 von 5.
    expect(screen.getAllByRole("img", { name: "4 von 5 Sternen" })).toHaveLength(2);
    expect(screen.getByRole("img", { name: "5 von 5 Sternen" })).toBeInTheDocument();

    const zurueck = screen.getByRole("link", { name: /Zurueck|Zurück/ });
    expect(zurueck).toHaveAttribute("href", "/marketing-planung");
  });

  it("zeigt einen leeren Zustand fuer Freelancer ohne Bio/Projekte", () => {
    const anna = getFreelancer("anna")!;
    render(<FreelancerDetailInhalt freelancer={anna} />);

    expect(screen.getByText("Anna")).toBeInTheDocument();
    expect(screen.getByText("Noch keine bisherigen Projekte hinterlegt.")).toBeInTheDocument();
    expect(
      screen.getByText("Noch keine ausführliche Beschreibung hinterlegt."),
    ).toBeInTheDocument();
  });
});
