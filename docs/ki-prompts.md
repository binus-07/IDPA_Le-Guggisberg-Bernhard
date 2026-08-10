# KI-Prompt-Protokoll

Vollständige Sammlung aller Prompts, mit denen KI-Tools zur Umsetzung dieses Projekts eingesetzt
wurden (Pflicht laut Wegleitung — vollständige Prompts gehören in den Anhang, KI-Nutzung ist als
Quelle zu erfassen). Der volle Prompt-Text steht jeweils im Abschnitt unterhalb der Tabelle.

| Datum      | Tool                          | Zweck                                                             | Prompt                                           |
| ---------- | ----------------------------- | ----------------------------------------------------------------- | ------------------------------------------------ |
| 2026-08-09 | Claude Code (claude-sonnet-5) | Phase A Fundament: Next.js/Supabase/Netlify-Grundgerüst aufsetzen | [siehe unten](#2026-08-09--phase-a-fundament)    |
| 2026-08-10 | Claude Code (claude-sonnet-5) | Phase B Auth & Rollen: Login, Registrierung, Rollenmodell, RLS    | [siehe unten](#2026-08-10--phase-b-auth--rollen) |

---

## 2026-08-09 — Phase A Fundament

**Tool:** Claude Code (Modell: claude-sonnet-5)
**Zweck:** Aufsetzen des Projektfundaments für Phase A (Next.js/TypeScript/App Router,
Tailwind + shadcn/ui mit Design-Tokens, Supabase-SSR-Anbindung, Health-Check-Route,
Vitest-Testsuite, Netlify-Konfiguration, README, ADRs, manuelle Schritte).

**Vollständiger Prompt:**

```
# Rolle

Du bist ein Senior Full-Stack-Entwickler und arbeitest eigenständig an einem Schulprojekt
(IDPA, Berufsmaturität Schweiz). Du arbeitest wie ein Teammitglied: Du planst, implementierst,
testest selbst, dokumentierst und pushst dein Ergebnis als Pull Request. Du fragst nur nach,
wenn eine Entscheidung fachlich nicht ohne Kontext getroffen werden kann — ansonsten
entscheidest du selbst und begründest die Entscheidung schriftlich.

# Projektkontext

Produkt: Webplattform, die Unternehmen mit Marketing-Freelancern zusammenbringt.
Team: 3 Personen (2x Applikationsentwicklung, 1x Mediamatik/Design).
Der komplette Umsetzungsplan liegt im Repo unter `docs/UMSETZUNGSPLAN.md`. Lies ihn als
Erstes vollständig und richte dich nach den dort definierten Konventionen.

Fixierter Tech-Stack (nicht zur Diskussion):
- Next.js (aktuelle stabile Version) mit TypeScript und App Router
- Supabase (Auth, Postgres, Storage)
- Netlify (Hosting)
- GitHub (Versionierung, GitHub Flow)

# Auftrag: Phase A – Fundament

Setze das Projektfundament auf. Konkret:

1. Next.js-Projekt mit TypeScript + App Router im Repo-Root initialisieren
   (`src/`-Verzeichnisstruktur, Import-Alias `@/*`).
2. Tailwind CSS + shadcn/ui einrichten. Design-Tokens als CSS-Variablen anlegen:
   Schrift Anton für Titel, Inter für Fliesstext, Border-Radius 8px.
3. ESLint + Prettier konfigurieren (inkl. `format`- und `lint`-npm-Scripts),
   damit alle drei Teammitglieder identisch formatieren.
4. Supabase-Anbindung via `@supabase/ssr` vorbereiten:
   - `src/lib/supabase/client.ts` (Browser-Client)
   - `src/lib/supabase/server.ts` (Server-Client mit Cookie-Handling)
   - `src/middleware.ts` für Session-Refresh
5. `.env.example` mit allen benötigten Variablen anlegen (Platzhalterwerte, keine echten Keys).
   `.env.local` muss in `.gitignore` stehen.
6. Health-Check-Route `/api/health`, die die Supabase-Verbindung prüft und
   `{ status: "ok" | "error", supabase: boolean }` zurückgibt.
7. Startseite mit „Hello World"-Platzhalter, der die Design-Tokens sichtbar verwendet.
8. `netlify.toml` mit korrekter Konfiguration für Next.js.
9. `README.md`: Setup-Anleitung (Schritt für Schritt, so dass ein Teammitglied das Projekt
   in unter 10 Minuten lokal starten kann), Stack-Übersicht, Scripts-Tabelle.
10. Ordnerstruktur gemäss Abschnitt 2 des Umsetzungsplans anlegen
    (inkl. `docs/adr/`, `supabase/migrations/`).

# Verifikationsschleife (verbindlich)

Du committest NIEMALS ungetesteten Code. Vor jedem Commit läuft dieser Durchlauf,
und zwar vollständig grün:

1. `npx tsc --noEmit`      → keine Typfehler
2. `npm run lint`          → keine Fehler
3. `npm run build`         → Build erfolgreich
4. `npm run test`          → alle Tests grün
5. Dev-Server starten, `/` und `/api/health` per curl abrufen, HTTP 200 verifizieren,
   Server wieder sauber beenden.

Richte dafür Vitest ein und schreibe mindestens diese Tests:
- Smoke-Test: Startseite rendert ohne Fehler
- Unit-Test: Supabase-Client wird korrekt instanziiert (Env-Variablen gemockt)
- Test der Health-Route für beide Fälle (Verbindung ok / Verbindung fehlgeschlagen)

Wenn ein Schritt fehlschlägt: Fehler lesen, Ursache benennen, beheben, komplette Schleife
erneut durchlaufen. Nach 3 erfolglosen Versuchen am selben Fehler brichst du ab und meldest
das Problem mit Fehlermeldung und deinen Lösungsversuchen — du baust keine Workarounds,
die das Problem nur verstecken (kein `// @ts-ignore`, kein Deaktivieren von Lint-Regeln,
kein Auskommentieren von Tests).

# Git-Workflow (verbindlich)

- Branch von `main`: `feature/phase-a-fundament`
- Kleine, thematisch saubere Commits — nicht ein Riesen-Commit am Schluss.
- Commit-Format: `typ: kurze beschreibung` in Kleinschreibung.
  Typen: `feat`, `fix`, `docs`, `chore`, `test`, `refactor`.
  Beispiele: `chore: next.js mit typescript und app router aufsetzen`,
  `feat: supabase ssr-client und health-route`, `test: smoke-tests für startseite`
- Nach jedem grünen Verifikationsdurchlauf: committen und pushen.
- Am Ende Pull Request nach `main` erstellen (`gh pr create`) mit:
  - Titel: `Phase A: Fundament`
  - Beschreibung: was umgesetzt wurde, welche Entscheidungen getroffen wurden,
    wie getestet wurde, was noch manuell erledigt werden muss
  - Checkliste der erledigten Punkte aus dem Auftrag oben
- Du mergst NICHT selbst. Der PR wird von einem Teammitglied reviewt.

# Dokumentationspflichten (Teil des Auftrags, nicht optional)

1. Schreibe für jede getroffene Technologieentscheidung einen ADR in `docs/adr/`
   nach dem Muster aus `docs/UMSETZUNGSPLAN.md` Abschnitt 3.2
   (Status / Kontext / Geprüfte Alternativen mit Vor- und Nachteilen /
   Entscheidung & Begründung / Risiken).
   Mindestens: UI-System (Tailwind + shadcn vs. Alternativen), Testing-Framework.
   Der ADR muss echte Alternativen nennen und die Nachteile der gewählten Option
   ehrlich benennen — das ist Bewertungskriterium der Schule.
2. Ergänze `docs/ki-prompts.md`: Datum, verwendetes Tool, dieser vollständige Prompt,
   Verwendungszweck. Falls die Datei nicht existiert, lege sie mit Tabellenkopf an.
3. Aktualisiere die Checkboxen der Phase A in `docs/UMSETZUNGSPLAN.md`.

# Grenzen — was du NICHT tust

- Keine echten Secrets, API-Keys oder Passwörter ins Repo. Niemals.
- Kein Force-Push, kein direkter Push auf `main`, kein Rewrite fremder Historie.
- Keine Features aus Phase B oder später (kein Auth-Flow, keine Profile, keine Suche).
- Keine zusätzlichen Dependencies ohne Notwendigkeit — jede Abhängigkeit im PR begründen.
- Aufgaben, die zwingend eine Weboberfläche brauchen (Supabase-Projekt anlegen,
  Netlify mit dem Repo verbinden, Umgebungsvariablen im Netlify-UI setzen), kannst du
  nicht erledigen. Bereite alles vor, was vorbereitbar ist, und schreibe eine präzise
  Schritt-für-Schritt-Anleitung nach `docs/manuelle-schritte.md`.
- Falls keine Supabase-Credentials verfügbar sind: Implementiere trotzdem vollständig,
  mocke die Verbindung in den Tests und markiere die Live-Verifikation als offenen Punkt.

# Ablauf

1. Repo und `docs/UMSETZUNGSPLAN.md` lesen, Ist-Zustand erfassen.
2. Umsetzungsplan für diesen Auftrag schreiben und mir zeigen, bevor du anfängst.
3. Umsetzen — in Schritten, jeweils mit vollständiger Verifikationsschleife und Commit.
4. Abschlussbericht: was umgesetzt, welche Entscheidungen, welche Tests, was ist offen,
   welche manuellen Schritte muss das Team noch machen.
```

**Anmerkung zur tatsächlichen Ausführung:** `docs/UMSETZUNGSPLAN.md` existierte im Repo noch
nicht und wurde vom Nutzer vor dem eigentlichen Auftrag bereitgestellt und committet. Die
Middleware wurde als `src/proxy.ts` statt `src/middleware.ts` umgesetzt, da Next.js 16 die
`middleware`-Datei-Konvention zugunsten von `proxy` als deprecated markiert (offizieller
Next.js-Codemod, siehe Commit-Historie und Pull-Request-Beschreibung).

---

## 2026-08-10 — Phase B Auth & Rollen

**Tool:** Claude Code (Modell: claude-sonnet-5)
**Zweck:** Registrierung/Login mit Supabase Auth, Rollenmodell (`unternehmen`/`freelancer`),
Tabelle `profiles` mit RLS, Onboarding-Flow, geschützte Routen, Passwort-Reset,
Dashboard-Skelette pro Rolle.

**Vollständiger Prompt:**

```
# Rolle

Du bist ein Senior Full-Stack-Entwickler und arbeitest eigenständig an einem Schulprojekt
(IDPA, Berufsmaturität Schweiz). Du planst, implementierst, testest selbst, dokumentierst
und lieferst dein Ergebnis als Pull Request ab. Du fragst nur nach, wenn eine Entscheidung
fachlich nicht ohne zusätzlichen Kontext getroffen werden kann — sonst entscheidest du
selbst und begründest die Entscheidung schriftlich.

# Projektkontext

Produkt: Webplattform, die Unternehmen mit Marketing-Freelancern zusammenbringt.
Team: 3 Personen (2x Applikationsentwicklung, 1x Mediamatik/Design).
Lies zuerst vollständig: `docs/UMSETZUNGSPLAN.md`, `CLAUDE.md` (falls vorhanden),
`README.md` und alle bestehenden ADRs in `docs/adr/`. Richte dich nach den dort
definierten Konventionen.

Fixierter Tech-Stack (nicht zur Diskussion):
Next.js (App Router) + TypeScript · Supabase (Auth, Postgres, Storage) · Tailwind +
shadcn/ui · Netlify · GitHub Flow.

Stand: Phase A ist abgeschlossen. Es existieren bereits Supabase-Clients
(`src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`), eine Health-Route
`/api/health` und ein Vitest-Setup. Du baust darauf auf und erfindest nichts neu.

Produktprinzipien aus der Nutzerbefragung, die für diese Phase gelten:
- Onboarding muss KURZ sein. Rollenwahl + Minimalangaben, mehr nicht.
- Strukturierte Eingaben (Auswahl, Dropdowns) statt Freitext, wo immer möglich.

# Auftrag: Phase B – Auth & Rollen

1. Registrierung und Login über Supabase Auth (E-Mail + Passwort).
   Seiten: `/registrieren`, `/anmelden`, Logout-Aktion. Deutschsprachige UI und
   deutschsprachige Fehlermeldungen (Supabase-Fehlercodes sauber übersetzen, keine
   rohen englischen Strings im UI).
2. Rollenmodell: `unternehmen` und `freelancer` (`admin` als Enum-Wert vorsehen, aber
   keine Admin-Funktionen bauen). Rolle als Postgres-Enum, nicht als freier Text.
3. Tabelle `profiles`: `id` (FK auf `auth.users`, PK), `rolle`, `anzeigename`,
   `erstellt_am`, `aktualisiert_am`. Anlage per Datenbank-Trigger auf `auth.users`
   (`handle_new_user`), damit kein Profil fehlen kann.
   Alles als versionierte SQL-Migration unter `supabase/migrations/` — Dateiname mit
   Zeitstempel-Präfix. Keine manuellen Klicks im Supabase-Studio.
4. Onboarding-Flow: Nach der Registrierung genau EIN Schritt — Rollenwahl mit zwei
   grossen Auswahlkarten und Anzeigename. Danach Weiterleitung auf das Dashboard der
   jeweiligen Rolle. Wer bereits eine Rolle hat, sieht das Onboarding nie wieder.
5. Row Level Security auf `profiles` aktivieren, mit expliziten Policies:
   - Jede:r darf das eigene Profil lesen und aktualisieren.
   - Authentifizierte Nutzer:innen dürfen fremde Profile lesen (Grundlage für die
     spätere Suche), aber nicht schreiben.
   - Kein Zugriff für anonyme Nutzer:innen.
   Begründe jede Policy als SQL-Kommentar in der Migration.
6. Geschützte Routen: Middleware/Proxy so erweitern, dass
   - nicht angemeldete Nutzer:innen auf geschützten Routen nach `/anmelden` gehen
     (mit `redirect`-Parameter zurück zum Ziel),
   - angemeldete Nutzer:innen ohne Rolle auf `/onboarding` landen,
   - `/dashboard/unternehmen` und `/dashboard/freelancer` jeweils nur für die
     passende Rolle erreichbar sind.
   Die Rollenprüfung muss zusätzlich serverseitig in der jeweiligen Route erfolgen —
   Middleware allein ist keine Sicherheitsgrenze. Erkläre das kurz im PR.
7. Dashboard-Skelette für beide Rollen: Begrüssung, Rollenanzeige, Logout,
   Platzhalter für die kommenden Phasen. Bewusst minimal, keine Features vorwegnehmen.
8. Passwort-Zurücksetzen per E-Mail (`/passwort-vergessen`, `/passwort-neu`).
   Falls der Supabase-Mailversand nicht konfiguriert ist: implementieren, testen,
   und die nötige manuelle Konfiguration in `docs/manuelle-schritte.md` beschreiben.

# Verifikationsschleife (verbindlich)

Du committest NIEMALS ungetesteten Code. Vor jedem Commit läuft dieser Durchlauf
vollständig grün:

1. `npx tsc --noEmit`   → keine Typfehler
2. `npm run lint`       → keine Fehler
3. `npm run build`      → Build erfolgreich
4. `npm run test`       → alle Tests grün
5. Dev-Server starten, manuell per curl verifizieren: `/anmelden` und `/registrieren`
   liefern 200, eine geschützte Route ohne Session liefert einen Redirect auf
   `/anmelden`. Server sauber beenden.

Neue Tests, die du schreibst:
- Unit: Rollen-Guard (richtige Rolle → Zugriff, falsche Rolle → Redirect, keine
  Session → Redirect auf `/anmelden`)
- Unit: Übersetzung der Supabase-Auth-Fehlercodes ins Deutsche
- Komponenten: Registrierungs- und Loginformular rendern und validieren
  (leere Felder, ungültige E-Mail, zu kurzes Passwort)
- E2E mit Playwright: Registrieren → Rolle wählen → Dashboard → Logout → erneut
  anmelden → Onboarding wird NICHT erneut angezeigt.
  Playwright einrichten, falls noch nicht vorhanden, und im README dokumentieren.
- Die RLS-Policies gegen die lokale Supabase-Instanz prüfen (`supabase start`):
  Nutzer A darf Profil B lesen, aber nicht schreiben. Falls die lokale Instanz in
  dieser Umgebung nicht läuft, dokumentiere den Testfall als manuell auszuführenden
  Schritt mit exaktem SQL.

Wenn ein Schritt fehlschlägt: Fehler lesen, Ursache benennen, beheben, komplette
Schleife erneut. Nach 3 erfolglosen Versuchen am selben Fehler abbrechen und melden.
Keine Workarounds, die das Problem verstecken — kein `@ts-ignore`, keine
deaktivierten Lint-Regeln, keine auskommentierten Tests, kein `.skip`.

# Git-Workflow (verbindlich)

- Branch von `main`: `feature/phase-b-auth`
- Kleine, thematisch saubere Commits. Format `typ: kurze beschreibung` in
  Kleinschreibung, Typen: `feat`, `fix`, `docs`, `chore`, `test`, `refactor`.
  Beispiele: `feat: registrierung und login mit supabase auth`,
  `feat: rls-policies für profiles`, `test: e2e-flow registrierung bis dashboard`
- Nach jedem grünen Verifikationsdurchlauf committen und pushen.
- Am Schluss PR nach `main` per `gh pr create`:
  Titel `Phase B: Auth & Rollen`. Beschreibung mit: Umgesetztes, getroffene
  Entscheidungen, Testabdeckung, offene Punkte, nötige manuelle Schritte,
  Checkliste der Auftragspunkte oben.
- Du mergst NICHT selbst. Ein Teammitglied reviewt.

# Dokumentationspflichten (Teil des Auftrags, nicht optional)

1. ADRs in `docs/adr/` nach dem Muster aus `docs/UMSETZUNGSPLAN.md` Abschnitt 3.2
   (Status / Kontext / Geprüfte Alternativen mit Vor- und Nachteilen / Entscheidung &
   Begründung / Risiken). Mindestens:
   - Authentifizierung: Supabase Auth vs. NextAuth vs. Eigenbau
   - Rollen- und Berechtigungsmodell: RLS in der Datenbank vs. Prüfung nur in der
     Applikationsschicht
   - E2E-Testing: Playwright vs. Cypress vs. keine E2E-Tests
   Jeder ADR nennt echte Alternativen und benennt die Nachteile der gewählten Option
   ehrlich. Das ist Bewertungskriterium der Schule, keine Formalie.
2. `docs/datenmodell.md` anlegen bzw. erweitern: die in dieser Phase entstandenen
   Tabellen als ER-Darstellung (Mermaid) plus Erklärung jedes Feldes und jeder Policy.
3. `docs/ki-prompts.md` ergänzen: Datum, Tool, dieser vollständige Prompt,
   Verwendungszweck.
4. Checkboxen der Phase B in `docs/UMSETZUNGSPLAN.md` abhaken.
5. README erweitern: wie startet ein Teammitglied die lokale Supabase-Instanz, wie
   führt es Migrationen aus, wie laufen die E2E-Tests.

# Grenzen — was du NICHT tust

- Keine echten Secrets, Keys oder Passwörter ins Repo. Niemals.
- Kein Force-Push, kein direkter Push auf `main`, kein Rewrite fremder Historie.
- Keine Features aus Phase C oder später: keine Freelancer-Profile mit Skills und
  Portfolio, keine Unternehmensprofile über den Anzeigenamen hinaus, keine Suche,
  kein Briefing, kein Chat, keine Bewertungen, keine Zahlungen.
- `profiles` bleibt schlank. Rollenspezifische Felder kommen erst in Phase C.
- Keine Schemaänderungen ohne Migration. Keine manuellen Änderungen im Supabase-Studio.
- Bestehende Dateien aus Phase A nicht umbauen, ohne den Grund im PR zu nennen.
- Keine zusätzlichen Dependencies ohne Notwendigkeit — jede im PR begründen.

# Ablauf

1. Repo, `docs/UMSETZUNGSPLAN.md` und bestehende ADRs lesen, Ist-Zustand erfassen.
2. Umsetzungsplan für diesen Auftrag schreiben und mir zeigen, BEVOR du anfängst.
   Warte auf meine Freigabe.
3. Umsetzen in Schritten, jeweils mit vollständiger Verifikationsschleife und Commit.
4. Abschlussbericht: was umgesetzt, welche Entscheidungen mit welcher Begründung,
   welche Tests mit welchem Ergebnis, was ist offen, welche manuellen Schritte
   muss das Team noch erledigen.
```

**Anmerkung zur tatsächlichen Ausführung:** Vor Beginn dieses Auftrags musste zuerst ein
unabhängiger, bereits vom Team vorbereiteter Branch (`chore/supabase-key-naming`, Umbenennung
`NEXT_PUBLIC_SUPABASE_ANON_KEY` → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, echter
Health-Check-Roundtrip) per eigenem PR gemergt werden, da Phase B auf dieser Namensgebung
aufbaut. Dabei entdeckte und behobene Nebensache: das Umbenennungs-Skript hatte `README.md`,
`docs/manuelle-schritte.md` und `.env.example` mit UTF-8-Mojibake beschädigt (Ursache eines
externen Werkzeugs, nicht dieses Auftrags) — korrigiert vor dem Merge (siehe
[PR #2](https://github.com/binus-07/IDPA_Le-Guggisberg-Bernhard/pull/2)).

Der Phase-B-Branch (`feature/phase-b-auth`) wurde vom Team zwischenzeitlich in zwei Teilen
gemerged: [PR #3](https://github.com/binus-07/IDPA_Le-Guggisberg-Bernhard/pull/3) (erste Hälfte,
während der laufenden Umsetzung gemerged) und
[PR #4](https://github.com/binus-07/IDPA_Le-Guggisberg-Bernhard/pull/4) (Rest: Passwort-Reset,
Playwright-E2E, ADRs, Doku, ein während der E2E-Testentwicklung gefundener und behobener
Login-Redirect-Bug). Details siehe die jeweiligen Pull-Request-Beschreibungen.
