import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Seitentitel } from "./seitentitel";

describe("Seitentitel", () => {
  it("zeigt Titel und Zurueck-Link, wenn zurueckHref gesetzt ist", () => {
    render(
      <Seitentitel
        titel="Auswahl"
        zurueckHref="/marketing-planung"
        zurueckLabel="Marketing Planung"
      />,
    );

    expect(screen.getByRole("heading", { name: "Auswahl" })).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/marketing-planung");
  });

  it("zeigt nur den Titel ohne zurueckHref", () => {
    render(<Seitentitel titel="Projekte" />);

    expect(screen.getByRole("heading", { name: "Projekte" })).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
