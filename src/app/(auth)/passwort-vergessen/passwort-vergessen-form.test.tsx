import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { passwortVergessenAnfordern } from "./actions";
import { PasswortVergessenForm } from "./passwort-vergessen-form";

vi.mock("./actions", () => ({
  passwortVergessenAnfordern: vi.fn(),
}));

describe("PasswortVergessenForm", () => {
  beforeEach(() => {
    vi.mocked(passwortVergessenAnfordern).mockReset();
  });

  it("rendert das E-Mail-Feld mit clientseitiger Basisvalidierung", () => {
    render(<PasswortVergessenForm />);
    const email = screen.getByLabelText("E-Mail");
    expect(email).toHaveAttribute("type", "email");
    expect(email).toBeRequired();
  });

  it("zeigt den Bestätigungshinweis, wenn die E-Mail verschickt wurde", async () => {
    vi.mocked(passwortVergessenAnfordern).mockResolvedValue({ gesendet: true });
    render(<PasswortVergessenForm />);

    fireEvent.change(screen.getByLabelText("E-Mail"), { target: { value: "test@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /link senden/i }));

    expect(await screen.findByText(/E-Mail unterwegs/)).toBeInTheDocument();
  });

  it("zeigt eine Fehlermeldung, wenn die Server Action einen Fehler zurückgibt", async () => {
    vi.mocked(passwortVergessenAnfordern).mockResolvedValue({
      error: "Zu viele Anfragen. Bitte warte einen Moment und versuche es erneut.",
    });
    render(<PasswortVergessenForm />);

    fireEvent.change(screen.getByLabelText("E-Mail"), { target: { value: "test@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /link senden/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/Zu viele Anfragen/);
  });
});
