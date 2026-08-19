import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getFreelancer } from "@/lib/mock/freelancer";
import { getKategorien } from "@/lib/mock/kategorien";
import { getProjekte } from "@/lib/mock/projekte";
import { UnternehmenDashboardInhalt } from "./inhalt";

describe("UnternehmenDashboardInhalt", () => {
  it("zeigt Hero, Promo-Kacheln, Kategorien und Top Freelancer", () => {
    const kategorien = getKategorien();
    const topFreelancer = [getFreelancer("hannes")!, getFreelancer("anna")!];
    const projekte = getProjekte();

    render(
      <UnternehmenDashboardInhalt
        kategorien={kategorien}
        topFreelancer={topFreelancer}
        projekte={projekte}
      />,
    );

    expect(
      screen.getByRole("heading", { name: /Ihr Marketing.*Effizient gestalten/ }),
    ).toBeInTheDocument();
    expect(screen.getByText("In wenigen Schritten zur Lösung")).toBeInTheDocument();

    const planErstellenLinks = screen.getAllByRole("link", { name: "Plan erstellen" });
    expect(planErstellenLinks).toHaveLength(2);
    planErstellenLinks.forEach((link) =>
      expect(link).toHaveAttribute("href", "/marketing-planung"),
    );

    expect(screen.getByRole("heading", { name: "Freelancer-Kategorien" })).toBeInTheDocument();
    kategorien.forEach((kategorie) => {
      expect(screen.getByText(kategorie.name)).toBeInTheDocument();
    });

    expect(screen.getByRole("heading", { name: "Top Freelancer" })).toBeInTheDocument();
    const hannesLink = screen.getByRole("link", { name: /Hannes/ });
    expect(hannesLink).toHaveAttribute("href", "/freelancer/hannes");
    const annaLink = screen.getByRole("link", { name: /Anna/ });
    expect(annaLink).toHaveAttribute("href", "/freelancer/anna");
  });
});
