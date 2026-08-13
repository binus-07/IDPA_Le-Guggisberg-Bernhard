import { expect, test } from "@playwright/test";
import { onboardingDurchlaufen } from "./helpers/onboarding";

function eindeutigeEmail(): string {
  return `e2e-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
}

test("Registrieren -> Rolle waehlen -> Dashboard -> Logout -> erneut anmelden ohne erneutes Onboarding", async ({
  page,
}) => {
  const email = eindeutigeEmail();
  const password = "sicheres-testpasswort";

  await page.goto("/registrieren");
  await page.getByLabel("E-Mail").fill(email);
  await page.getByLabel("Passwort").fill(password);
  await page.getByRole("button", { name: "Registrieren" }).click();

  // Lokale Supabase-Instanz hat E-Mail-Bestaetigung deaktiviert (supabase/config.toml) --
  // signUp() liefert direkt eine Session, also geht es sofort weiter zum Onboarding.
  //
  // toHaveURL() statt waitForURL() bewusst: Server-Action-Redirects in Next.js sind
  // Client-Side-Navigationen (RSC-Response, kein voller Seiten-Reload), lösen also kein
  // "load"-Event aus, auf das waitForURL() standardmässig wartet. toHaveURL() pollt
  // dagegen den tatsächlichen URL-Zustand und ist damit fuer diesen Fall robust.
  await expect(page).toHaveURL("/onboarding");
  await onboardingDurchlaufen(page, "freelancer", "E2E Testperson");

  await expect(page).toHaveURL("/dashboard/freelancer");
  await expect(page.getByRole("heading", { name: "Meine Projekte" })).toBeVisible();

  // Abmelden ist im Mockup nicht vorgesehen und haengt deshalb hinter dem Avatar-Menue
  // (siehe AppShell/PR-Beschreibung) -- erst oeffnen, dann klicken.
  await page.getByRole("button", { name: "Konto-Menue" }).click();
  await page.getByRole("button", { name: "Abmelden" }).click();
  await expect(page).toHaveURL("/anmelden");

  await page.getByLabel("E-Mail").fill(email);
  await page.getByLabel("Passwort").fill(password);
  await page.getByRole("button", { name: "Anmelden" }).click();

  // Onboarding wird NICHT erneut angezeigt -- die Login-Action leitet direkt ins passende
  // Dashboard weiter, weil das Profil bereits eine Rolle hat.
  await expect(page).toHaveURL("/dashboard/freelancer");
  await expect(page.getByRole("heading", { name: "Meine Projekte" })).toBeVisible();
});
