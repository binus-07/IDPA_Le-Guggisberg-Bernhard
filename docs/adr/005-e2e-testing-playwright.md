# ADR 005: E2E-Testing — Playwright

**Status:** entschieden

**Kontext:**

Phase B verlangt einen echten End-to-End-Test des kompletten Auth-Flows (Registrieren → Rolle
wählen → Dashboard → Logout → erneut anmelden, ohne dass das Onboarding erneut erscheint). Unit-
und Komponententests (Vitest, ADR 002 aus Phase A) reichen dafür nicht aus, weil sie weder einen
echten Browser noch eine echte Supabase-Session/-Datenbank durchlaufen.

**Geprüfte Alternativen:**

- **Playwright (gewählt).** Vorteile: ein Tool für Browser-Steuerung und Test-Runner in einem,
  offizielle Microsoft-Unterstützung, gute Windows-Kompatibilität (relevant, da im Team mit
  Windows entwickelt wird), eingebautes `webServer`-Feature startet den Next-Dev-Server und die
  App automatisch für den Testlauf. Nachteile: eigenes Test-Ökosystem parallel zu Vitest (zwei
  Test-Runner im Projekt), Browser-Binaries müssen lokal installiert werden
  (`npx playwright install chromium`).

- **Cypress.** Vorteile: sehr verbreitet, gute Fehlermeldungen und Zeitreise-Debugging in der UI.
  Nachteile: läuft historisch primär im Browser selbst (nicht ausserhalb wie Playwright), was
  Cross-Origin- und Server-Action-Redirect-Szenarien wie unseren Auth-Flow komplizierter macht;
  Multi-Browser-Support (insb. WebKit) ist schwächer als bei Playwright.

- **Keine E2E-Tests, nur Komponenten-/Unit-Tests.** Vorteile: kein zusätzliches Tool, schnellere
  CI. Nachteile: hätte den Fehler, den wir tatsächlich beim Bau dieses Tests gefunden haben, nicht
  aufgedeckt (siehe Risiken unten) — Unit-Tests mocken die Server Actions und die
  Rollen-Guard-Logik einzeln, decken aber nicht ab, ob die Kette aus Server-Action-Redirect und
  Proxy-Redirect im echten Next.js-Client tatsächlich zusammenspielt.

**Entscheidung & Begründung:**

Playwright, gegen die lokale Supabase-Instanz (`supabase start`), nicht gegen das echte
Produktions-Projekt — damit E2E-Testdaten (Wegwerf-Testkonten) nie im echten Projekt landen.
`playwright.config.ts` liest die lokalen Zugangsdaten automatisch über `supabase status -o json`
und überschreibt damit `NEXT_PUBLIC_SUPABASE_*` nur für den Testlauf.

**Risiken / Nachteile:**

- Ein zweiter Test-Runner (neben Vitest) bedeutet zwei Konfigurationen, zwei
  Kommandos (`npm run test`, `npm run test:e2e`), die beide grün sein müssen.
- E2E-Tests brauchen eine laufende lokale Supabase-Instanz (Docker) — ohne Docker sind sie nicht
  ausführbar; das ist in `playwright.config.ts` mit einer klaren Fehlermeldung abgefangen, ersetzt
  aber nicht Docker selbst als Voraussetzung.
- Der E2E-Test deckte tatsächlich einen echten Bug auf, der mit reinen Unit-Tests unsichtbar
  geblieben wäre: die Login-Server-Action leitete ursprünglich immer über `/onboarding` um und
  verliess sich darauf, dass der Proxy von dort ein zweites Mal weiterleitet. Diese zweite,
  proxy-seitige Umleitung direkt im Anschluss an eine Server-Action-Navigation wurde vom
  Next.js-Client nicht zuverlässig verfolgt (reproduzierbar im echten Browser, nicht aber bei
  manueller, langsamerer Bedienung) — die Login-Action leitet jetzt direkt zum Ziel weiter, ohne
  auf eine zweite Umleitung zu setzen. Das zeigt den Wert des Tests, ist aber auch ein Hinweis,
  dass Server-Action-Redirects, die von einem Proxy-Redirect gefolgt werden, im aktuellen
  Next.js grundsätzlich mit Vorsicht zu behandeln sind.
