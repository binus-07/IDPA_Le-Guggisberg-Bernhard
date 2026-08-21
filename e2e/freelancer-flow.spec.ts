import { expect, test } from "@playwright/test";
import { onboardingDurchlaufen } from "./helpers/onboarding";

function eindeutigeEmail(): string {
  return `e2e-freelancer-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
}

test("Dashboard Unternehmen -> Freelancer-Uebersicht -> Freelancer-Detail", async ({ page }) => {
  const email = eindeutigeEmail();
  const password = "sicheres-testpasswort";

  await page.goto("/registrieren");
  await page.getByLabel("E-Mail").fill(email);
  await page.getByLabel("Passwort").fill(password);
  await page.getByRole("button", { name: "Registrieren" }).click();

  await expect(page).toHaveURL("/onboarding");
  await onboardingDurchlaufen(page, "unternehmen", "E2E Unternehmen");

  await expect(page).toHaveURL("/dashboard/unternehmen");
  await page.getByRole("link", { name: "Freelancer" }).click();

  await expect(page).toHaveURL("/freelancer");
  await expect(page.getByRole("heading", { name: "Freelancer" })).toBeVisible();

  await page.getByRole("link", { name: /Hannes/ }).click();

  await expect(page).toHaveURL("/freelancer/hannes");
  // exact: true, sonst matcht auch der Next.js-Route-Announcer ("Hannes – Freelancer").
  await expect(page.getByText("Hannes", { exact: true })).toBeVisible();
});
