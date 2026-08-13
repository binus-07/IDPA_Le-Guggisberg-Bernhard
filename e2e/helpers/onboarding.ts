import { type Page } from "@playwright/test";

/**
 * Fuehrt den mehrstufigen Onboarding-Wizard (7 Schritte fuer Freelancer, 6 fuer Unternehmen,
 * danach der Willkommen-Screen) bis zum Dashboard durch. Weder die Rollen-Buttons noch das
 * Anzeigename-Feld sind ueber name-/label-Attribute ansprechbar (kein role="menu"-Bezug, kein
 * htmlFor/id) -- deshalb Platzhaltertext bzw. Icon+Titel-Praefix als Locator.
 */
export async function onboardingDurchlaufen(
  page: Page,
  rolle: "unternehmen" | "freelancer",
  anzeigename: string,
) {
  // Schritt 0: Rollenauswahl
  const rollenName = rolle === "unternehmen" ? /^business Unternehmen/ : /^person Freelancer/;
  await page.getByRole("button", { name: rollenName }).click();
  await page.getByRole("button", { name: "Weiter" }).click();

  // Schritt 1: Profil-Setup
  await page.getByPlaceholder("Dein Name auf der Plattform").fill(anzeigename);
  if (rolle === "unternehmen") {
    await page.getByPlaceholder("Name deines Unternehmens").fill("E2E Testfirma");
  }
  await page.getByRole("button", { name: "Weiter" }).click();

  if (rolle === "unternehmen") {
    // Schritt 2: Branche
    await page.getByRole("button", { name: /Tech & Software/ }).click();
    await page.getByRole("button", { name: "Weiter" }).click();

    // Schritt 3: Groesse
    await page.getByRole("button", { name: /1–10 Mitarbeitende/ }).click();
    await page.getByRole("button", { name: "Weiter" }).click();

    // Schritt 4: Gesuchte Leistungen
    await page.getByRole("button", { name: /Fotografie/ }).click();
    await page.getByRole("button", { name: "Weiter" }).click();

    // Schritt 5: Dringlichkeit -- loest nach "Weiter" die Server Action aus
    await page.getByRole("button", { name: /^Sofort/ }).click();
    await page.getByRole("button", { name: "Weiter" }).click();
  } else {
    // Schritt 2: Spezialisierung
    await page.getByRole("button", { name: /Fotografie/ }).click();
    await page.getByRole("button", { name: "Weiter" }).click();

    // Schritt 3: Branchen-Erfahrung
    await page.getByRole("button", { name: /Tech & Software/ }).click();
    await page.getByRole("button", { name: "Weiter" }).click();

    // Schritt 4: Bio & Erfahrung
    await page.locator("select").selectOption("2-5");
    await page
      .getByPlaceholder("Beschreibe kurz deine Erfahrung und was dich ausmacht...")
      .fill("Langjaehrige Erfahrung mit Foto- und Videoproduktionen fuer KMU.");
    await page.getByRole("button", { name: "Weiter" }).click();

    // Schritt 5: Verfuegbarkeit
    await page.getByRole("button", { name: /^Sofort verfügbar/ }).click();
    await page.getByRole("button", { name: "Weiter" }).click();

    // Schritt 6: Portfolio (optional) -- Ueberspringen loest die Server Action aus
    await page.getByRole("button", { name: "Überspringen" }).click();
  }

  // Sobald die Server Action erfolgreich ist, schreibt sie die Rolle in die DB und der
  // bestehende Route-Guard (aus Phase B, unveraendert) leitet bei jedem naechsten Aufruf von
  // /onboarding direkt aufs Dashboard um. Next.js aktualisiert die Server-Komponenten der
  // aktuellen Route automatisch nach jeder Server Action -- dieser Guard-Refresh gewinnt in der
  // Praxis IMMER das Rennen gegen den Client-seitigen Uebergang zum "Du bist bereit."-Screen, der
  // dadurch faktisch unerreichbar ist. Deshalb auf beide moeglichen Ausgaenge warten, statt nur
  // auf den (unzuverlaessigen) Willkommen-Screen.
  const dashboardUrl = rolle === "unternehmen" ? "/dashboard/unternehmen" : "/dashboard/freelancer";
  const willkommen = page.getByRole("heading", { name: "Du bist bereit." });

  await Promise.race([
    willkommen.waitFor({ state: "visible", timeout: 15_000 }),
    page.waitForURL(`**${dashboardUrl}`, { timeout: 15_000 }),
  ]);

  if (!page.url().includes(dashboardUrl)) {
    await page.getByRole("link", { name: /Zur Plattform/ }).click();
  }
}
