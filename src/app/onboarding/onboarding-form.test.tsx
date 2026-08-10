import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { onboarding } from "./actions";
import { OnboardingForm } from "./onboarding-form";

vi.mock("./actions", () => ({
  onboarding: vi.fn(),
}));

describe("OnboardingForm", () => {
  beforeEach(() => {
    vi.mocked(onboarding).mockReset();
  });

  it("rendert den Anzeigenamen sowie genau zwei Rollen-Karten", () => {
    render(<OnboardingForm />);

    const anzeigename = screen.getByLabelText("Anzeigename");
    expect(anzeigename).toBeRequired();
    expect(anzeigename).toHaveAttribute("maxLength", "80");

    const unternehmen = screen.getByRole("button", { name: /^unternehmen/i });
    const freelancer = screen.getByRole("button", { name: /^freelancer/i });
    expect(unternehmen).toHaveAttribute("name", "rolle");
    expect(unternehmen).toHaveAttribute("value", "unternehmen");
    expect(freelancer).toHaveAttribute("name", "rolle");
    expect(freelancer).toHaveAttribute("value", "freelancer");
  });

  it("zeigt eine Fehlermeldung, wenn die Server Action einen Fehler zurückgibt", async () => {
    vi.mocked(onboarding).mockResolvedValue({ error: "Bitte eine Rolle wählen" });
    render(<OnboardingForm />);

    fireEvent.change(screen.getByLabelText("Anzeigename"), { target: { value: "Linus" } });
    fireEvent.click(screen.getByRole("button", { name: /^freelancer/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Bitte eine Rolle wählen");
  });
});
