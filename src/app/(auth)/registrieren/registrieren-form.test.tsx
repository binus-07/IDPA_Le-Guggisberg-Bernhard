import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { registrieren } from "./actions";
import { RegistrierenForm } from "./registrieren-form";

vi.mock("./actions", () => ({
  registrieren: vi.fn(),
}));

describe("RegistrierenForm", () => {
  beforeEach(() => {
    vi.mocked(registrieren).mockReset();
  });

  it("rendert E-Mail- und Passwort-Feld mit clientseitiger Basisvalidierung", () => {
    render(<RegistrierenForm />);

    const email = screen.getByLabelText("E-Mail");
    const password = screen.getByLabelText("Passwort");

    expect(email).toHaveAttribute("type", "email");
    expect(email).toBeRequired();
    expect(password).toHaveAttribute("type", "password");
    expect(password).toHaveAttribute("minLength", "8");
    expect(password).toBeRequired();
  });

  it("zeigt eine Fehlermeldung, wenn die Server Action einen Fehler zurückgibt", async () => {
    vi.mocked(registrieren).mockResolvedValue({
      error: "E-Mail-Adresse oder Passwort ist falsch.",
    });
    render(<RegistrierenForm />);

    fireEvent.change(screen.getByLabelText("E-Mail"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText("Passwort"), {
      target: { value: "sicheres-passwort" },
    });
    fireEvent.click(screen.getByRole("button", { name: /registrieren/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "E-Mail-Adresse oder Passwort ist falsch.",
    );
  });

  it("zeigt den Bestätigungshinweis, wenn nach der Registrierung keine Session zurückkommt", async () => {
    vi.mocked(registrieren).mockResolvedValue({ emailBestaetigungNoetig: true });
    render(<RegistrierenForm />);

    fireEvent.change(screen.getByLabelText("E-Mail"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText("Passwort"), {
      target: { value: "sicheres-passwort" },
    });
    fireEvent.click(screen.getByRole("button", { name: /registrieren/i }));

    expect(await screen.findByText(/Fast geschafft/)).toBeInTheDocument();
  });
});
