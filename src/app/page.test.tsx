import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getKategorien } from "@/lib/mock/kategorien";
import Home from "./page";

describe("Home", () => {
  it("rendert Hero, Registrieren-/Anmelden-Buttons und die Kategorien-Vorschau", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: /Marketing-Freelancer.*einfach finden/ }),
    ).toBeInTheDocument();

    const registrieren = screen.getByRole("link", { name: "Registrieren" });
    expect(registrieren).toHaveAttribute("href", "/registrieren");
    const anmelden = screen.getByRole("link", { name: "Anmelden" });
    expect(anmelden).toHaveAttribute("href", "/anmelden");

    getKategorien().forEach((kategorie) => {
      expect(screen.getByText(kategorie.name)).toBeInTheDocument();
    });
  });
});
