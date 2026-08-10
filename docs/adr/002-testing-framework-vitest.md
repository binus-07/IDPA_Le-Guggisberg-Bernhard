# ADR 002: Testing-Framework — Vitest

**Status:** entschieden

**Kontext:**

Der Auftrag für Phase A verlangt eine verbindliche Verifikationsschleife vor jedem Commit,
darunter eine automatisierte Testsuite (Smoke-Test Startseite, Unit-Test Supabase-Client,
Test der Health-Route). Wir brauchen ein Test-Framework, das gut mit Next.js 16 (App Router,
React Server Components, Turbopack) und TypeScript zusammenspielt und für drei
Teammitglieder ohne grosse Testerfahrung schnell verständlich ist.

**Geprüfte Alternativen:**

- **Vitest (gewählt).** Vorteile: nutzt Vite/Rollup-Tooling, dadurch sehr kurze Start- und
  Testlaufzeiten (kein separater Transpile-Schritt wie bei Jest+Babel/ts-jest nötig), API ist
  praktisch identisch zu Jest (`describe`/`it`/`expect`/`vi.fn`), wodurch der Umstieg trivial ist
  und viele Jest-Tutorials übertragbar bleiben, native ESM- und TypeScript-Unterstützung ohne
  zusätzliche Transform-Konfiguration. Nachteile: jüngeres Projekt als Jest, kleineres (wenn auch
  wachsendes) Ökosystem an Drittanbieter-Matchern/Plugins; einzelne Next.js-spezifische Jest-
  Community-Pakete (z. B. manche `next/jest`-Presets) haben keine 1:1-Entsprechung und mussten
  hier durch eigene, kleine `vitest.config.ts` + `jsdom`-Umgebung ersetzt werden.

- **Jest (mit `next/jest`).** Vorteile: von Next.js offiziell dokumentierter Standardweg, riesiges
  Ökosystem, sehr ausführliche Dokumentation und Beispiele. Nachteile: spürbar langsamer bei
  Kaltstart und Watch-Mode (eigener Transform-Layer statt Vite-Pipeline), Konfiguration für
  TypeScript/ESM in einem Next.js-16/Turbopack-Projekt ist erfahrungsgemäss fehleranfälliger
  (divergierende Modul-Resolution zwischen Turbopack-Build und Jest-Transform).

- **Playwright (nur End-to-End, keine Unit-Tests).** Vorteile: testet echte Browser-Interaktion,
  wäre für Phase B (Login-Flow) ohnehin sinnvoll. Nachteile: kein Ersatz für schnelle
  Unit-/Smoke-Tests auf Komponenten- und Route-Ebene, wie sie Phase A explizit verlangt; deutlich
  langsamer pro Testlauf. Playwright ergänzt Vitest später (E2E ab Phase B), ersetzt es aber nicht.

**Entscheidung & Begründung:**

Vitest, kombiniert mit `@testing-library/react` für Komponenten-Tests und `jsdom` als
Testumgebung. Die Wahl minimiert Setup- und Wartezeit (wichtig bei drei Personen mit begrenzter
Testerfahrung und engem Zeitrahmen) und bleibt bei Bedarf jederzeit auf Jest-ähnliche Patterns
umsteigbar, falls sich das Next.js-Ökosystem stärker in Richtung eines der beiden Tools bewegt.

**Risiken / Nachteile:**

- Weniger Next.js-spezifische Community-Presets als bei Jest — Konfigurationsprobleme müssen
  öfter selbst gelöst werden statt eine fertige Lösung zu übernehmen.
- Server Components mit `async`/Datenzugriff lassen sich mit Testing Library nur eingeschränkt
  direkt rendern; solche Fälle werden nach Bedarf über Integrations-/E2E-Tests (Playwright, ab
  Phase B) abgedeckt statt über Vitest-Unit-Tests.
