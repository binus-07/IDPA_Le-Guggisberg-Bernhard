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

  it("zeigt Schritt 0 mit zwei Rollen-Karten, Weiter bleibt deaktiviert bis eine gewaehlt ist", () => {
    render(<OnboardingForm />);

    const unternehmen = screen.getByRole("button", { name: /^business Unternehmen/ });
    const freelancer = screen.getByRole("button", { name: /^person Freelancer/ });
    expect(unternehmen).toBeInTheDocument();
    expect(freelancer).toBeInTheDocument();

    const weiter = screen.getByRole("button", { name: "Weiter" });
    expect(weiter).toBeDisabled();

    fireEvent.click(freelancer);
    expect(weiter).toBeEnabled();
  });

  it("fuehrt nach Rollenwahl zum Anzeigename-Feld in Schritt 1", () => {
    render(<OnboardingForm />);

    fireEvent.click(screen.getByRole("button", { name: /^business Unternehmen/ }));
    fireEvent.click(screen.getByRole("button", { name: "Weiter" }));

    const anzeigename = screen.getByPlaceholderText("Dein Name auf der Plattform");
    expect(anzeigename).toHaveAttribute("maxLength", "80");
    // Firmenname ist nur fuer die Rolle "unternehmen" sichtbar.
    expect(screen.getByPlaceholderText("Name deines Unternehmens")).toBeInTheDocument();
  });

  it("zeigt eine Fehlermeldung, wenn die Server Action beim letzten Schritt einen Fehler zurückgibt", async () => {
    vi.mocked(onboarding).mockResolvedValue({ error: "Speichern hat nicht geklappt." });
    render(<OnboardingForm />);

    // Kompletter Unternehmen-Ablauf (kuerzerer der beiden Zweige: 4 statt 6 Schritte) bis zum
    // Schritt, der die Server Action ausloest.
    fireEvent.click(screen.getByRole("button", { name: /^business Unternehmen/ }));
    fireEvent.click(screen.getByRole("button", { name: "Weiter" }));

    fireEvent.change(screen.getByPlaceholderText("Dein Name auf der Plattform"), {
      target: { value: "Linus" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Weiter" }));

    fireEvent.click(screen.getByRole("button", { name: /Tech & Software/ }));
    fireEvent.click(screen.getByRole("button", { name: "Weiter" }));

    fireEvent.click(screen.getByRole("button", { name: /1–10 Mitarbeitende/ }));
    fireEvent.click(screen.getByRole("button", { name: "Weiter" }));

    // Die Fehlermeldung ist im Markup ein normales div ohne role="alert" -- kein
    // Accessible-Name-Bezug moeglich, deshalb ueber den Text statt ueber die Rolle geprueft.
    expect(await screen.findByText("Speichern hat nicht geklappt.")).toBeInTheDocument();
    expect(onboarding).toHaveBeenCalledWith(
      expect.objectContaining({ rolle: "unternehmen", anzeigename: "Linus" }),
    );
  });
});
