import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { passwortNeuSetzen } from "./actions";
import { PasswortNeuForm } from "./passwort-neu-form";

vi.mock("./actions", () => ({
  passwortNeuSetzen: vi.fn(),
}));

describe("PasswortNeuForm", () => {
  beforeEach(() => {
    vi.mocked(passwortNeuSetzen).mockReset();
  });

  it("rendert das Passwort-Feld mit clientseitiger Basisvalidierung", () => {
    render(<PasswortNeuForm />);
    const password = screen.getByLabelText("Neues Passwort");
    expect(password).toHaveAttribute("type", "password");
    expect(password).toHaveAttribute("minLength", "8");
    expect(password).toBeRequired();
  });

  it("zeigt eine Fehlermeldung, wenn die Server Action einen Fehler zurückgibt", async () => {
    vi.mocked(passwortNeuSetzen).mockResolvedValue({
      error: "Das neue Passwort muss sich vom bisherigen unterscheiden.",
    });
    render(<PasswortNeuForm />);

    fireEvent.change(screen.getByLabelText("Neues Passwort"), {
      target: { value: "ein-neues-passwort" },
    });
    fireEvent.click(screen.getByRole("button", { name: /passwort speichern/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/muss sich vom bisherigen/);
  });
});
