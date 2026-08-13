import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getProjekt } from "@/lib/mock/projekte";
import { ProjektDetailInhalt } from "./inhalt";

describe("ProjektDetailInhalt", () => {
  it("zeigt Titel, Beschreibung und alle 3 Teilaufgaben mit formatierten Betraegen", () => {
    const projekt = getProjekt("brack-alltron")!;
    render(<ProjektDetailInhalt projekt={projekt} />);

    expect(
      screen.getByRole("heading", { name: "Brack.alltron Mitarbeiter Plattform erstellen" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Teilaufgaben" })).toBeInTheDocument();

    expect(screen.getByText("Webseite erstellen")).toBeInTheDocument();
    expect(screen.getByText("Mitarbeiter fotografieren")).toBeInTheDocument();
    expect(screen.getByText("Mockup designen")).toBeInTheDocument();

    expect(screen.getByText(/CHF 4’000/)).toBeInTheDocument();
    expect(screen.getByText(/CHF 1’500/)).toBeInTheDocument();
    expect(screen.getByText(/CHF 1’800/)).toBeInTheDocument();

    const balken = screen.getAllByRole("progressbar");
    expect(balken).toHaveLength(3);
    expect(balken[0]).toHaveAttribute("aria-valuenow", "41");
    expect(balken[1]).toHaveAttribute("aria-valuenow", "87");
    expect(balken[2]).toHaveAttribute("aria-valuenow", "100");

    const zurueck = screen.getByRole("link", { name: /Projekte/ });
    expect(zurueck).toHaveAttribute("href", "/projekte");
  });
});
