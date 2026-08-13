import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Sternebewertung } from "./sternebewertung";

describe("Sternebewertung", () => {
  it.each([0, 1, 3, 5])("zeigt %i gefuellte von 5 Sternen mit passendem aria-label", (wert) => {
    render(<Sternebewertung wert={wert} />);

    const bewertung = screen.getByRole("img", { name: `${wert} von 5 Sternen` });
    const sterne = Array.from(bewertung.children);

    expect(sterne).toHaveLength(5);
    const gefuellt = sterne.filter((stern) => stern.textContent === "★").length;
    const leer = sterne.filter((stern) => stern.textContent === "☆").length;
    expect(gefuellt).toBe(wert);
    expect(leer).toBe(5 - wert);
  });

  it("markiert jedes Sternzeichen als aria-hidden", () => {
    render(<Sternebewertung wert={4} />);

    const bewertung = screen.getByRole("img", { name: "4 von 5 Sternen" });
    Array.from(bewertung.children).forEach((stern) => {
      expect(stern).toHaveAttribute("aria-hidden", "true");
    });
  });

  it("klemmt Werte ausserhalb von 0-5", () => {
    render(<Sternebewertung wert={7} />);
    expect(screen.getByRole("img", { name: "5 von 5 Sternen" })).toBeInTheDocument();
  });
});
