import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { anmelden } from "./actions";
import { AnmeldenForm } from "./anmelden-form";

vi.mock("./actions", () => ({
  anmelden: vi.fn(),
}));

describe("AnmeldenForm", () => {
  beforeEach(() => {
    vi.mocked(anmelden).mockReset();
  });

  it("rendert E-Mail- und Passwort-Feld mit clientseitiger Basisvalidierung", () => {
    render(<AnmeldenForm redirectTo="" />);

    const email = screen.getByLabelText("E-Mail");
    const password = screen.getByLabelText("Passwort");

    expect(email).toHaveAttribute("type", "email");
    expect(email).toBeRequired();
    expect(password).toHaveAttribute("type", "password");
    expect(password).toBeRequired();
  });

  it("gibt das redirect-Ziel als verstecktes Feld mit", () => {
    render(<AnmeldenForm redirectTo="/dashboard/freelancer" />);

    const hidden = document.querySelector('input[name="redirect"]');
    expect(hidden).toHaveValue("/dashboard/freelancer");
  });

  it("zeigt eine Fehlermeldung, wenn die Server Action einen Fehler zurückgibt", async () => {
    vi.mocked(anmelden).mockResolvedValue({ error: "E-Mail-Adresse oder Passwort ist falsch." });
    render(<AnmeldenForm redirectTo="" />);

    fireEvent.change(screen.getByLabelText("E-Mail"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText("Passwort"), { target: { value: "irgendwas" } });
    fireEvent.click(screen.getByRole("button", { name: /anmelden/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "E-Mail-Adresse oder Passwort ist falsch.",
    );
  });
});
