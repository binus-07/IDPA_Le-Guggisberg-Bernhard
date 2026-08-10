import { describe, expect, it } from "vitest";
import { determineRedirect } from "./route-guard";

describe("determineRedirect", () => {
  it("erlaubt Zugriff aufs eigene Dashboard bei richtiger Rolle", () => {
    expect(
      determineRedirect({
        pathname: "/dashboard/freelancer",
        hasSession: true,
        rolle: "freelancer",
      }),
    ).toBeNull();
  });

  it("leitet bei falscher Rolle auf das eigene Dashboard um", () => {
    expect(
      determineRedirect({
        pathname: "/dashboard/unternehmen",
        hasSession: true,
        rolle: "freelancer",
      }),
    ).toBe("/dashboard/freelancer");
  });

  it("leitet ohne Session auf /anmelden um, mit redirect-Parameter zum Ziel", () => {
    expect(
      determineRedirect({ pathname: "/dashboard/freelancer", hasSession: false, rolle: null }),
    ).toBe("/anmelden?redirect=%2Fdashboard%2Ffreelancer");
  });

  it("leitet /onboarding ohne Session auf /anmelden um", () => {
    expect(determineRedirect({ pathname: "/onboarding", hasSession: false, rolle: null })).toBe(
      "/anmelden?redirect=%2Fonboarding",
    );
  });

  it("erlaubt /onboarding mit Session und ohne Rolle", () => {
    expect(
      determineRedirect({ pathname: "/onboarding", hasSession: true, rolle: null }),
    ).toBeNull();
  });

  it("leitet /onboarding weg, wenn schon eine Rolle gesetzt ist", () => {
    expect(
      determineRedirect({ pathname: "/onboarding", hasSession: true, rolle: "unternehmen" }),
    ).toBe("/dashboard/unternehmen");
  });

  it("leitet ins Onboarding, wenn ein Dashboard ohne Rolle aufgerufen wird", () => {
    expect(
      determineRedirect({ pathname: "/dashboard/unternehmen", hasSession: true, rolle: null }),
    ).toBe("/onboarding");
  });

  it("erlaubt oeffentliche Routen unabhaengig vom Session-Status", () => {
    expect(determineRedirect({ pathname: "/", hasSession: false, rolle: null })).toBeNull();
    expect(determineRedirect({ pathname: "/", hasSession: true, rolle: "freelancer" })).toBeNull();
  });

  it("leitet eingeloggte Nutzer:innen von /anmelden weg (mit Rolle -> Dashboard)", () => {
    expect(
      determineRedirect({ pathname: "/anmelden", hasSession: true, rolle: "unternehmen" }),
    ).toBe("/dashboard/unternehmen");
  });

  it("leitet eingeloggte Nutzer:innen ohne Rolle von /registrieren ins Onboarding um", () => {
    expect(determineRedirect({ pathname: "/registrieren", hasSession: true, rolle: null })).toBe(
      "/onboarding",
    );
  });

  it("erlaubt /anmelden ohne Session", () => {
    expect(determineRedirect({ pathname: "/anmelden", hasSession: false, rolle: null })).toBeNull();
  });
});
