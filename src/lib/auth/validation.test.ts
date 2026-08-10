import { describe, expect, it } from "vitest";
import {
  anmeldenSchema,
  anzeigenameSchema,
  onboardingSchema,
  registrierenSchema,
} from "./validation";

describe("registrierenSchema", () => {
  it("akzeptiert eine gueltige E-Mail und ein ausreichend langes Passwort", () => {
    const result = registrierenSchema.safeParse({
      email: "test@example.com",
      password: "sicheres-passwort",
    });
    expect(result.success).toBe(true);
  });

  it("lehnt leere Felder ab", () => {
    const result = registrierenSchema.safeParse({ email: "", password: "" });
    expect(result.success).toBe(false);
  });

  it("lehnt eine ungueltige E-Mail-Adresse ab", () => {
    const result = registrierenSchema.safeParse({
      email: "keine-email",
      password: "sicheres-passwort",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toMatch(/gueltige E-Mail/);
    }
  });

  it("lehnt ein zu kurzes Passwort ab", () => {
    const result = registrierenSchema.safeParse({
      email: "test@example.com",
      password: "kurz",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toMatch(/mindestens 8 Zeichen/);
    }
  });
});

describe("anmeldenSchema", () => {
  it("verlangt nur ein nicht-leeres Passwort, keine Mindestlaenge", () => {
    const result = anmeldenSchema.safeParse({ email: "test@example.com", password: "x" });
    expect(result.success).toBe(true);
  });

  it("lehnt ein leeres Passwort ab", () => {
    const result = anmeldenSchema.safeParse({ email: "test@example.com", password: "" });
    expect(result.success).toBe(false);
  });
});

describe("anzeigenameSchema", () => {
  it("trimmt Leerzeichen", () => {
    const result = anzeigenameSchema.safeParse("  Linus  ");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("Linus");
    }
  });

  it("lehnt einen leeren Anzeigenamen ab", () => {
    expect(anzeigenameSchema.safeParse("   ").success).toBe(false);
  });
});

describe("onboardingSchema", () => {
  it("akzeptiert eine gueltige Rolle mit Anzeigename", () => {
    expect(
      onboardingSchema.safeParse({ rolle: "freelancer", anzeigename: "Linus" }).success,
    ).toBe(true);
  });

  it("lehnt eine unbekannte Rolle ab (z. B. admin ist im Onboarding nicht waehlbar)", () => {
    expect(
      onboardingSchema.safeParse({ rolle: "admin", anzeigename: "Linus" }).success,
    ).toBe(false);
  });
});
