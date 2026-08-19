import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AppShell } from "./app-shell";

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard/unternehmen",
}));

describe("AppShell", () => {
  it("zeigt die Navigation mit aktivem Home-Eintrag fuer Unternehmen", () => {
    render(
      <AppShell rolle="unternehmen">
        <p>Inhalt</p>
      </AppShell>,
    );

    const home = screen.getByRole("link", { name: "Home" });
    expect(home).toHaveAttribute("href", "/dashboard/unternehmen");
    expect(home).toHaveClass("text-primary");

    expect(screen.getByRole("link", { name: "Marketing Planung" })).toHaveAttribute(
      "href",
      "/marketing-planung",
    );
    expect(screen.getByRole("link", { name: "Projekte" })).toHaveAttribute("href", "/projekte");

    const chats = screen.getByText("Chats");
    expect(chats).toHaveAttribute("aria-disabled", "true");
    expect(chats.tagName).not.toBe("A");

    expect(screen.getByRole("button", { name: "Konto-Menue" })).toBeInTheDocument();
    expect(screen.getByText("Inhalt")).toBeInTheDocument();
  });

  it("Home zeigt auf das Freelancer-Dashboard, wenn rolle freelancer ist", () => {
    render(
      <AppShell rolle="freelancer">
        <p>Inhalt</p>
      </AppShell>,
    );

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/dashboard/freelancer",
    );
  });
});
