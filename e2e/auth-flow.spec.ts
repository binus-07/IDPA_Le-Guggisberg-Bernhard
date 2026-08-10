import { expect, test } from "@playwright/test";

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
  await page.getByLabel("Anzeigename").fill("E2E Testperson");
  await page.getByRole("button", { name: /^Freelancer/ }).click();

  await expect(page).toHaveURL("/dashboard/freelancer");
  await expect(page.getByText("Rolle: Freelancer")).toBeVisible();

  await page.getByRole("button", { name: "Abmelden" }).click();
  await expect(page).toHaveURL("/anmelden");

  await page.getByLabel("E-Mail").fill(email);
  await page.getByLabel("Passwort").fill(password);
  await page.getByRole("button", { name: "Anmelden" }).click();

  // Onboarding wird NICHT erneut angezeigt -- die Login-Action leitet direkt ins passende
  // Dashboard weiter, weil das Profil bereits eine Rolle hat.
  await expect(page).toHaveURL("/dashboard/freelancer");
  await expect(page.getByText("Rolle: Freelancer")).toBeVisible();
});
