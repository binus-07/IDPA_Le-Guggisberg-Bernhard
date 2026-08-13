import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getFreelancers } from "@/lib/mock/freelancer";
import { MarketingPlanungInhalt } from "./inhalt";

describe("MarketingPlanungInhalt", () => {
  it("zeigt Titel, Einleitung und alle 7 Freelancer-Karten mit Verlinkung", () => {
    const freelancer = getFreelancers();
    render(<MarketingPlanungInhalt freelancer={freelancer} />);

    expect(
      screen.getByRole("heading", { name: "Wählen Sie einen passenden Freelancer aus" }),
    ).toBeInTheDocument();

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(7);

    freelancer.forEach((person) => {
      const link = screen.getByRole("link", { name: new RegExp(person.name) });
      expect(link).toHaveAttribute("href", `/freelancer/${person.id}`);
    });
  });

  it("zeigt das Stern-Abzeichen nur bei Hannes (empfohlen)", () => {
    const freelancer = getFreelancers();
    render(<MarketingPlanungInhalt freelancer={freelancer} />);

    const hannesLink = screen.getByRole("link", { name: /Hannes/ });
    expect(hannesLink.querySelector("svg")).toBeInTheDocument();

    const lenaLink = screen.getByRole("link", { name: /Lena/ });
    expect(lenaLink.querySelector("svg")).not.toBeInTheDocument();
  });
});
