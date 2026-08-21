import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getFreelancers } from "@/lib/mock/freelancer";
import { FreelancerUebersichtInhalt } from "./inhalt";

describe("FreelancerUebersichtInhalt", () => {
  it("zeigt den Seitentitel, alle Freelancer-Karten und einen 'Alle'-Filter, wenn keiner aktiv ist", () => {
    const freelancer = getFreelancers();
    const rollen = [...new Set(freelancer.map((f) => f.rolle))];
    render(
      <FreelancerUebersichtInhalt freelancer={freelancer} rollen={rollen} aktiveRolle={null} />,
    );

    expect(screen.getByRole("heading", { name: "Freelancer" })).toBeInTheDocument();

    const link = screen.getByRole("link", { name: new RegExp(freelancer[0].name) });
    expect(link).toHaveAttribute("href", `/freelancer/${freelancer[0].id}`);

    const alleFilter = screen.getByRole("link", { name: "Alle" });
    expect(alleFilter).toHaveAttribute("href", "/freelancer");
  });

  it("verlinkt jede Rolle als Filter-Pill mit ?skill=-Parameter und markiert die aktive Rolle", () => {
    render(
      <FreelancerUebersichtInhalt
        freelancer={[]}
        rollen={["Fotograf", "Web Grafikerin"]}
        aktiveRolle="Fotograf"
      />,
    );

    const fotografFilter = screen.getByRole("link", { name: "Fotograf" });
    expect(fotografFilter).toHaveAttribute("href", "/freelancer?skill=Fotograf");

    const webFilter = screen.getByRole("link", { name: "Web Grafikerin" });
    expect(webFilter).toHaveAttribute("href", "/freelancer?skill=Web%20Grafikerin");
  });

  it("zeigt einen leeren Zustand ohne passende Freelancer", () => {
    render(<FreelancerUebersichtInhalt freelancer={[]} rollen={[]} aktiveRolle={null} />);

    expect(screen.getByText("Keine Freelancer gefunden.")).toBeInTheDocument();
  });
});
