import { AuthApiError } from "@supabase/supabase-js";
import { describe, expect, it } from "vitest";
import { translateAuthError } from "./error-messages";

describe("translateAuthError", () => {
  it("übersetzt invalid_credentials ins Deutsche", () => {
    const error = new AuthApiError("Invalid login credentials", 400, "invalid_credentials");
    expect(translateAuthError(error)).toBe("E-Mail-Adresse oder Passwort ist falsch.");
  });

  it("übersetzt weak_password ins Deutsche", () => {
    const error = new AuthApiError("Password is too weak", 422, "weak_password");
    expect(translateAuthError(error)).toMatch(/zu schwach/);
  });

  it("übersetzt user_already_exists ins Deutsche", () => {
    const error = new AuthApiError("User already registered", 422, "user_already_exists");
    expect(translateAuthError(error)).toMatch(/existiert bereits/);
  });

  it("gibt für unbekannte Codes die deutsche Fallback-Meldung zurück, nie die rohe Original-Message", () => {
    const error = new AuthApiError("Some future error", 500, "ein_ganz_neuer_code");
    const message = translateAuthError(error);
    expect(message).toBe("Etwas ist schiefgelaufen. Bitte versuche es später erneut.");
    expect(message).not.toContain("Some future error");
  });

  it("gibt die Fallback-Meldung zurück, wenn kein Error vorhanden ist", () => {
    expect(translateAuthError(null)).toBe("Etwas ist schiefgelaufen. Bitte versuche es später erneut.");
    expect(translateAuthError(undefined)).toBe(
      "Etwas ist schiefgelaufen. Bitte versuche es später erneut.",
    );
  });
});
