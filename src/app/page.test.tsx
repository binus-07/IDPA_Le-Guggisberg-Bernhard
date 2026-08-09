import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  it("rendert ohne Fehler und zeigt den Hello-World-Platzhalter", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { name: /hello world/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /los geht's/i })).toBeInTheDocument();
  });
});
