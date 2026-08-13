# KI-Prompt-Protokoll

Vollständige Sammlung aller Prompts, mit denen KI-Tools zur Umsetzung dieses Projekts eingesetzt
wurden (Pflicht laut Wegleitung — vollständige Prompts gehören in den Anhang, KI-Nutzung ist als
Quelle zu erfassen). Der volle Prompt-Text steht jeweils im Abschnitt unterhalb der Tabelle.

| Datum      | Tool                          | Zweck                                                             | Prompt                                                                |
| ---------- | ----------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------- |
| 2026-08-09 | Claude Code (claude-sonnet-5) | Phase A Fundament: Next.js/Supabase/Netlify-Grundgerüst aufsetzen | [siehe unten](#2026-08-09--phase-a-fundament)                         |
| 2026-08-10 | Claude Code (claude-sonnet-5) | Phase B Auth & Rollen: Login, Registrierung, Rollenmodell, RLS    | [siehe unten](#2026-08-10--phase-b-auth--rollen)                      |
| 2026-08-13 | Claude Code (claude-sonnet-5) | Mockup-Umsetzung: Dark-Theme + vier Adobe-XD-Screens              | [siehe unten](#2026-08-13--mockup-umsetzung-dark-theme--vier-screens) |

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

---

## 2026-08-13 — Mockup-Umsetzung: Dark-Theme + vier Screens

**Tool:** Claude Code (Modell: claude-sonnet-5)
**Zweck:** Vollständige Umsetzung des ersten Adobe-XD-Mockups (vier Screens: Home/Dashboard,
Freelancer-Auswahl, Freelancer-Detail, Projekt-Detail) als durchgängiges Dark-Theme, inkl.
Design-Tokens, gemeinsamer Komponenten, Mock-Daten und Anpassung aller bereits bestehenden Seiten
an dieselbe Gestaltung.

**Vollständiger Erstprompt:**

```
Auftrag

Setze das Adobe-XD-Mockup der Marketing-Freelancer-Plattform vollständig um: alle vier gestalteten Screens als echte Seiten, dazu ein durchgängiges Dark-Theme, und passe alle bereits bestehenden Seiten an dieselbe Gestaltung an.

Die Applikation wird ausschliesslich dunkel. Kein Light Mode, kein Theme-Switcher. Diese Entscheidung ist getroffen und nicht zu hinterfragen.

Arbeitsweise: Branch feature/mockup-umsetzung. Committe nach jedem abgeschlossenen Abschnitt einzeln in Conventional-Commit-Form, damit der PR reviewbar bleibt. Am Schluss ein PR über die GitHub CLI.

Erstelle zuerst einen Plan und zeige ihn mir, bevor du eine Zeile Code schreibst. Im Plan soll stehen, welche Dateien du anlegst, welche du änderst, und in welcher Reihenfolge du committest.

Alle Masse in diesem Dokument sind aus dem Mockup ausgemessen und beziehen sich auf das 1920 px breite Artboard. Sie sind verbindlich. Runde nicht, "verbessere" nichts, ergänze nichts.

1. Design-Tokens
Farben
Rolle    Hex    oklch    Verwendung
Hintergrund
#060B13    oklch(0.1481 0.0197 257.28)    ganzflächig, alle Screens
Fläche / Karte
#252B36    oklch(0.2881 0.0219 262.50)    Karten, Panels, Listeneinträge
Akzent
#CC5C3B    oklch(0.6086 0.1505 37.10)    nur primäre CTA-Buttons
Text primär
#FFFFFF    oklch(1 0 0)    sämtlicher Text
Text gedämpft
#A0A4AB    oklch(0.7146 0.0106 253.5)    Sekundärtext — Kontrastkorrektur, siehe Abschnitt 11

Das ist die vollständige Palette. Im gesamten Mockup gibt es keine weiteren Flächenfarben.

Der Akzent #CC5C3B erscheint im Entwurf ausschliesslich auf den beiden CTA-Buttons „Plan erstellen". Er ist Primärfarbe für Buttons — nicht für Links, Rahmen, Icons, Badges, Fortschrittsbalken oder Fokusringe. Diese Zurückhaltung ist das prägende Merkmal des Entwurfs. Wenn du unsicher bist, ob etwas orange sein soll: nein.

Zusätzlich abzuleiten:

--border: oklch(1 0 0 / 8%) — im Mockup gibt es keine sichtbaren Rahmen, Karten trennen sich allein über die Fläche
--input: Kartenfläche #252B36, Rahmen oklch(1 0 0 / 12%)
--ring: Akzent bei 50 % Deckkraft
--destructive: nicht im Mockup vorhanden, shadcn-Dark-Default übernehmen und im ADR notieren

Schrift

Beide Familien sind in src/app/layout.tsx bereits eingebunden: Anton als --font-anton, Inter als --font-inter. Im Mockup steht statt Inter die Windows-Systemschrift Segoe UI. Die ist nicht webtauglich; Inter ist der bewusst gewählte Ersatz mit nahezu identischen Metriken.

Rolle    Schrift    @1920    Vorkommen
Display    Anton    75 px    Hero Home, Seitentitel Screen 2
Seitentitel    Inter Black    50 px    „Auswahl", „Projekte"
H2    Anton    40 px    Projekttitel im Banner
H2 alt    Inter Bold    40 px    „Bisherige Projekte", „Teilaufgaben"
H3    Anton    30 px    Karten-Headline „Produkt Promoten"
Abschnittslabel    Inter Regular    40 px    „Freelancer-Kategorien", „Top Freelancer"
Name gross    Inter Bold    35 px    „Thomas Wenger"
Name    Inter Regular    35 px    Freelancer-Karten
Zeilentitel    Inter Regular    30 px    Projekt- und Aufgabentitel
Lead    Inter Light    34 px    Untertitel unter Display
Body gross    Inter Light    26 px    Rollenangabe, Auftragsbeschreibung
Body    Inter Regular    20 px    Standardtext, Navigation
Body Light    Inter Light    20 px    Fliesstext in Karten
Small    Inter Light    18 px    „seit 12 Jahren"
Button    Inter Bold    18 px    CTA-Beschriftung

Beachte den Wechsel: Anton wird nicht durchgängig für Überschriften verwendet. „Bisherige Projekte" und „Teilaufgaben" stehen in Inter Bold, die Seitentitel in Inter Black. Übernimm das genau so, auch wenn es inkonsistent wirkt.

Diese Werte gelten bei 1920 px. Skaliere darunter proportional herunter — Richtwert ×0.75 bei 1280 px, ×0.6 auf Tablet, ×0.5 auf Mobile. Für Display und Seitentitel clamp() verwenden.

Radien

Aus den Pfadgeometrien des Mockups zurückgerechnet:

Karten, Panels, Listeneinträge: 8 px → --radius: 0.5rem
Buttons: 16 px → --radius-button: 1rem
Bilder in Karten und Kacheln: 40 px → --radius-image: 2.5rem
Avatar in der Navigation: vollständig rund, 61 px

Die 40 px auf Bildern sind auffällig und prägen den Look. Nicht an die Kartenradien angleichen.

Layout
Inhaltsbreite 1680 px, zentriert, linke Kante bei x = 131 → max-w-[1680px] mx-auto
Abstandsskala: 8 / 16 / 24 / 32 / 48 / 64 / 100 / 120 px
Horizontales Padding responsiv, auf Desktop so, dass die 1680 px erreicht werden

2. Globale Bausteine
src/app/globals.css

Ersetze das komplette shadcn-Standardthema. :root enthält direkt die dunklen Werte, es gibt keinen .dark-Block und keine helle Variante mehr. Entferne @custom-variant dark, falls danach ungenutzt. Ergänze --radius-button und --radius-image im @theme inline-Block.

src/app/layout.tsx

Stelle sicher, dass die App in keinem Zustand hell rendert. Setze <meta name="color-scheme" content="dark">, damit native Formularelemente und Scrollbalken mitziehen.

src/components/ui/*

Passe button.tsx, card.tsx, input.tsx, label.tsx an die Tokens an:

Button default: Akzentfläche, weisser Text, Radius 16 px, Inter Bold 18 px, kein Rahmen, Innenabstand horizontal 32 px, Höhe 42 px (gemessen: 156 × 42 px bei der Beschriftung „Plan erstellen")
Button secondary: Kartenfläche, weisser Text
Button ghost / link: transparent, weisser Text, Hover leicht aufgehellt
Card: Fläche #252B36, Radius 8 px, kein sichtbarer Rahmen, kein Schlagschatten
Input: Kartenfläche, dezenter Rahmen, sichtbarer Fokusring

Erfinde keine neuen Varianten.

src/components/app-shell.tsx

Alle vier Screens teilen denselben Rahmen. Baue ihn einmal:

Navigation oben links, Grundlinie bei y = 124, beginnend bei x = 131
Einträge: Home · Marketing Planung · Projekte · Chats, Inter Regular 20 px, Abstand zwischen den Einträgen rund 48 px
Der aktive Eintrag steht in Inter Black, alle anderen in Regular — gleiche Farbe, gleiche Grösse. Die Auszeichnung erfolgt allein über die Schriftstärke, nicht über Farbe oder Unterstreichung.
Avatar-Button oben rechts: Kreis 61 px bei x = 1746, y = 86, weisser Rahmen 2 px, transparente Füllung, Personen-Icon in Weiss
Dekorative Punktkugel oben rechts, angeschnitten am oberen und rechten Rand, hinter der Navigation liegend, nicht klickbar

Die Navigation rendert ihre Einträge aus einer Konstante und bestimmt den aktiven Zustand über usePathname(). Für die Route Chats, die es noch nicht gibt, rendere den Eintrag deaktiviert statt als toten Link.

Zur Kugelgrafik: Die Datei liegt noch nicht im Repo und existiert bisher nur mit schwarzem statt transparentem Hintergrund. Referenziere /sphere.webp aus public/, rendere sie nur wenn vorhanden, und trage in docs/manuelle-schritte.md ein, dass Timon sie transparent aus XD exportieren muss. Ohne die Grafik darf das Layout nicht brechen.

Es gibt keine Wortmarke. Die Navigation beginnt direkt mit „Home". Setze keinen Platzhalter-Schriftzug ein.

Seitentitel-Komponente

Screens 3 und 4 haben oben links einen Zurück-Pfeil plus Titel in Inter Black 50 px, Grundlinie y = 288. Der Pfeil steht links davon, gleiche optische Höhe. Bau das als wiederverwendbare Komponente.

3. Routen-Zuordnung

Die vier Screens zeigen die eingeloggte Anwendung aus Sicht eines Unternehmens. Ordne sie so zu:

Screen    Route    Bemerkung
1 Home    /dashboard/unternehmen    ersetzt das bestehende Skelett
2 Freelancer-Auswahl    /marketing-planung    neu
3 Freelancer-Detail    /freelancer/[id]    neu
4 Projekt-Detail    /projekte/[id]    neu, plus /projekte als Übersicht
—    /chats    noch nicht anlegen, Navigationseintrag deaktiviert

Der Navigationseintrag „Home" zeigt auf das rollenrichtige Dashboard. Das Freelancer-Dashboard /dashboard/freelancer ist im Mockup nicht gestaltet — siehe Abschnitt 9.

Die öffentliche Startseite / bleibt die Seite für nicht eingeloggte Besucher und bekommt kein App-Shell, aber dieselbe Gestaltung.

Falls dir diese Zuordnung falsch erscheint: halt an und frag nach, bevor du Routen anlegst.

4. Screen 1 — Home (/dashboard/unternehmen)

Artboardhöhe 3646 px. Von oben nach unten:

Hero
Zeile 1 „Ihr Marketing", Anton 75 px, x = 132, Grundlinie y = 472
Zeile 2 „Effizient gestalten", Anton 75 px, Grundlinie y = 584 → Zeilenabstand 112 px
Untertitel „In wenigen Schritten zur Lösung", Inter Light 34 px, Grundlinie y = 728
Rechts daneben die Punktkugel aus dem Shell, die in den Hero-Bereich hineinragt
Darunter viel Leerraum bis y = 1266 — das ist gewollt, nicht zusammenziehen

Zwei Promo-Kacheln

Der auffälligste Teil des Entwurfs: spiegelbildlich aufgebaut, Bild ragt über die Karte hinaus.

Linke Kachel „Produkt Promoten":

Karte #252B36, x = 132, y = 1266, 625 × 828 px
Bild 422 × 634 px bei x = 460, y = 1353, Radius 40 px — die rechte Bildkante liegt bei x = 882 und damit 125 px ausserhalb der Karte
Titel „Produkt Promoten", Anton 30 px, x = 161, Grundlinie y = 1848
Text „Produkt in der Praxis vermarkten", Inter 20 px, x = 161, y = 1884
CTA „Plan erstellen", 156 × 42 px, x = 162, y = 1940

Rechte Kachel „Marke Promoten" — exakt gespiegelt:

Karte #252B36, x = 1188, y = 1265, 621 × 828 px
Bild 422 × 634 px bei x = 1053, y = 1353 — die linke Bildkante liegt 135 px links ausserhalb der Karte
Titel „Marke Promoten", Anton 40 px, x = 1516, Grundlinie y = 1352
Text „Gestalte wie der Markt deine Marke sieht", Inter 20 px, zweizeilig ab y = 1400
CTA „Plan erstellen", 156 × 42 px, x = 1516, y = 1460

Beachte: die linke Kachel hat Text und CTA unten, die rechte oben. Titelgrössen sind unterschiedlich (30 px links, 40 px rechts). Das ist so im Entwurf. Übernimm es.

Bau das als eine Komponente mit einer Prop für die Spiegelung, nicht als zwei Kopien.

Freelancer-Kategorien
Label „Freelancer-Kategorien", Inter Regular 40 px, x = 131, Grundlinie y = 2192
6 Karten à 252 × 404 px, y = 2277, x = 136 / 420 / 704 / 988 / 1272 / 1557 → Abstand 32 px
Aufbau je Karte: Bild oben, füllt die Karte bis auf den Textbereich, Radius 40 px; Beschriftung unten zentriert, Inter Regular 30 px, Grundlinie y = 2624
Kategorien in dieser Reihenfolge: Videografie · Webprogrammierung · Fotografie · Content Creation · Print Grafik · Web Grafik
„Webprogrammierung" bricht auf zwei Zeilen und steht dann in 25 px, „Content Creation" in 28 px. Löse das über automatischen Umbruch und eine leicht kleinere Schrift bei langen Labels, nicht über Sonderfälle pro Kategorie.

Top Freelancer
Label „Top Freelancer", Inter Regular 40 px, x = 134, Grundlinie y = 2868
5 Karten à 252 × 349 px, y = 2954, x = 142 / 494 / 846 / 1198 / 1550 → Abstand 100 px
Aufbau je Karte: Portrait oben, Radius 40 px, darüber rechts oben ein sternförmiges Abzeichen, das über die Bildkante ragt; Name Inter Regular 35 px Grundlinie y = 3220; Rolle Inter Light 26 px Grundlinie y = 3260, in gedämpfter Farbe
Inhalte: Anna / Web Grafikerin · Thomas / Content Creator · Hannes / Fotograf · Matthäus / Videograf · Melina / Grafikerin Print
Karte ist als Ganzes anklickbar und führt auf /freelancer/[id]

5. Screen 2 — Freelancer-Auswahl (/marketing-planung)

Artboardhöhe 1847 px.

Titel „Wählen Sie einen passenden Freelancer aus", Anton 75 px, x = 121, Grundlinie y = 340
Einleitung, Inter Light 34 px, x = 131, zweizeilig ab y = 448, Zeilenabstand 44 px
Karten 370 × 431 px, Fläche #252B36, Radius 8 px
Raster: 4 Spalten, x = 131 / 568 / 1004 / 1441 → Abstand 67 px; Zeilen y = 618 und y = 1105 → Abstand 56 px

Aufbau je Karte (Offsets relativ zur Kartenkante oben links):

Portrait links oben, ab +28 px, quadratisch rund 182 px, Radius 40 px
Name rechts daneben, x-Offset +226, Inter Regular 35 px, Grundlinie +34
Rolle darunter, Inter Light 26 px, Grundlinie +78, gedämpft
„seit N Jahren", Inter Light 18 px, Grundlinie +114, gedämpft
Beschreibungstext über die volle Kartenbreite, x-Offset +28, ab Grundlinie +266, Inter Light 20 px, Zeilenabstand 28 px, auf 5 Zeilen begrenzt mit hartem Abschneiden

Die Texte im Mockup brechen mitten im Satz ab — das ist Absicht, die Karte schneidet den Text. Setze das mit line-clamp-5 um, nicht mit Auslassungspunkten im Datenbestand.

Auf der ersten Karte sitzt dasselbe sternförmige Abzeichen wie bei „Top Freelancer" — es markiert empfohlene Freelancer. Steuere es über ein Feld in den Daten, nicht über die Position im Raster.

Die zweite Zeile ist nur mit drei Karten gefüllt. Das Raster bleibt vierspaltig, die Lücke bleibt leer — nicht zentrieren, nicht strecken.

Jede Karte ist als Ganzes anklickbar und führt auf /freelancer/[id].

6. Screen 3 — Freelancer-Detail (/freelancer/[id])

Artboardhöhe 1948 px.

Zurück-Pfeil plus Titel „Auswahl", Inter Black 50 px, x = 230, Grundlinie y = 288
Ein grosses Panel #252B36, x = 131, y = 398, 1680 × 1448 px, Radius 8 px. Der gesamte restliche Inhalt liegt darin.

Innerhalb des Panels:

Kopfbereich

Portrait links, x = 202, y = 442, rund 515 × 520 px, Radius 40 px
Name „Thomas Wenger", Inter Bold 35 px, x = 769, Grundlinie y = 452
„Fotograf seit 22 Jahren", Inter Light 26 px, x = 769, Grundlinie y = 504, gedämpft
Fliesstext ab x = 769, Grundlinie y = 584, Inter Light 20 px, Zeilenabstand 28 px, Textbreite bis x = 1751 — also rund 980 px. Nicht die volle Panelbreite nutzen.

Bisherige Projekte

Überschrift „Bisherige Projekte", Inter Bold 40 px, x = 202, Grundlinie y = 1044
Drei Einträge, Titelgrundlinien y = 1144 / 1392 / 1640 → Abstand 248 px
Je Eintrag: Bild links, x = 200, rund 352 × 212 px, Radius 40 px; Textblock ab x = 597
Titel Inter Regular 30 px
Beschreibung Inter Light 20 px, ein bis zwei Zeilen, Abstand zum Titel 44 px
Zeile „Kommentar des Auftraggebers:" in Inter Regular 20 px, das Zitat direkt anschliessend in Inter Light 20 px — eine Zeile, zwei Schriftstärken
Fusszeile: Datum in Inter Regular 20 px, danach ein Mittelpunkt als Trenner, danach die Bewertung als fünf Sterne. Gefüllte Sterne ★, leere ☆.

Zur Bewertung: setze sie als eigene Komponente um, die einen Wert von 0 bis 5 entgegennimmt und fünf Sterne rendert. Gib ihr ein aria-label in der Form „4 von 5 Sternen" und markiere die Sternzeichen selbst als aria-hidden.

Im Mockup fehlt eine Kontakt- oder Anfrage-Aktion. Das ist eine Lücke im Entwurf, keine Entwurfsentscheidung. Setze keinen Button ein und notiere den Punkt im PR-Text für Timon.

7. Screen 4 — Projekt-Detail (/projekte/[id])

Artboardhöhe 1948 px.

Zurück-Pfeil plus Titel „Projekte", Inter Black 50 px, x = 198, Grundlinie y = 288

Projekt-Banner

Vollbreites Bild, x = 131, y = 383, 1680 × 450 px, Radius 8 px
Über dem unteren Bilddrittel liegt ein dunkler Verlauf von unten nach oben, damit der Text lesbar bleibt
Projekttitel „Brack.alltron Mitarbeiter Plattform erstellen", Anton 40 px, x = 170, Grundlinie y = 684
Auftragsbeschreibung, Inter Light 26 px, x = 170, zweizeilig ab y = 728, Zeilenabstand 36 px

Teilaufgaben

Überschrift „Teilaufgaben", Inter Bold 40 px, x = 202, Grundlinie y = 988
Drei Einträge, Titelgrundlinien y = 1068 / 1320 / 1572 → Abstand 252 px
Je Eintrag: Bild links, x = 200, rund 352 × 218 px, Radius 40 px; Textblock ab x = 599
Titel Inter Regular 30 px
Fortschrittsbalken rechts neben dem Titel, x = 1010 bis 1500, Höhe 4 px, auf Titelhöhe. Ungefüllter Teil in gedämpfter Farbe, gefüllter Teil in Weiss — nicht im Akzent.
Metazeile, Inter Regular 20 px, Grundlinie +76 relativ zum Titel: Name, Rolle, Betrag, Frist, getrennt durch Mittelpunkte mit Leerzeichen. Beträge in der Form CHF 4'000 mit Hochkomma-Tausendertrennung nach Schweizer Schreibweise.
Zeile „Letzte Nachricht:" mit dem Zitat in Anführungszeichen, Inter Regular 20 px, Grundlinie +140

Die Einträge haben im Mockup keine eigene Kartenfläche — sie liegen direkt auf dem Seitenhintergrund. Nicht in Karten packen.

Lege zusätzlich /projekte als Übersicht an: Seitentitel „Projekte", darunter die Projekte als Liste im selben Aufbau wie die Teilaufgaben, jeweils verlinkt auf /projekte/[id]. Diese Seite ist nicht gestaltet — halte sie streng an das Muster von Screen 4.

8. Daten

Für diese Screens existiert noch kein Datenmodell — das kommt in Phase C. Trotzdem darfst du keine Werte fest in die Komponenten schreiben.

Lege src/lib/mock/ an mit typisierten Modulen: freelancer.ts, projekte.ts, kategorien.ts
Definiere die Typen in src/lib/types/ und exportiere sie sauber, damit Phase C sie durch die generierten Supabase-Typen ersetzen kann
Jede Mock-Datei bekommt oben einen Kommentar: // TODO Phase C: durch Supabase-Abfrage ersetzen
Die Inhalte übernimmst du wörtlich aus dem Mockup — alle sieben Freelancer von Screen 2, das Projekt Brack.alltron mit seinen drei Teilaufgaben, die sechs Kategorien, die fünf Top-Freelancer
Seiten holen ihre Daten über eine Funktion (getFreelancer(id), getProjekt(id)), nicht über direkten Import des Arrays. Dann ist der Austausch in Phase C ein Eingriff an einer Stelle.
Bilder: lege Platzhalter in public/mock/ ab oder nutze farbige Flächen in der gedämpften Farbe. Verwende keine externen Bild-URLs und keine Bilder aus dem Mockup, deren Herkunft ungeklärt ist. Trage in docs/manuelle-schritte.md ein, dass Timon lizenzfreie Bilder nachliefern muss — das ist auch für die IDPA-Quellenangabe relevant.

9. Bestehende Seiten anpassen

Diese Seiten sind gebaut, aber nicht gestaltet. Zieh sie auf dasselbe Niveau, indem du ihre Form aus den vier Screens ableitest — erfinde keine neuen Muster.

/registrieren, /anmelden, /passwort-vergessen, /passwort-neu

Zentrierte Karte auf dem Seitenhintergrund, maximal 480 px breit, Fläche #252B36, Radius 8 px, Innenabstand 48 px. Titel in Anton, Feldbeschriftungen Inter Regular 20 px. Genau ein Akzent-Button pro Formular, alles Weitere secondary oder link. Kein App-Shell, da nicht eingeloggt — aber die Punktkugel oben rechts als dekoratives Element beibehalten.

/onboarding

Zwei Auswahlkarten nebeneinander, aufgebaut wie die Promo-Kacheln von Screen 1: Kartenfläche, Titel in Anton, kurze Beschreibung, Aktion. Ohne die überstehenden Bilder — die Spiegelung wäre hier sinnlos. Rollen: Unternehmen und Freelancer.

/dashboard/freelancer

Im Mockup nicht gestaltet. Baue es als Spiegelbild von Screen 1 aus Freelancer-Sicht: Hero mit Anrede, darunter eine Liste offener Anfragen im Aufbau der Teilaufgaben von Screen 4, darunter „Meine Projekte" im selben Raster wie die Kategorienkarten. Keine Promo-Kacheln — die ergeben für Freelancer keinen Sinn.

/ (öffentliche Startseite)

Hero im Stil von Screen 1, darunter eine kurze Erklärung der Plattform, darunter die Kategorien-Karten als Vorschau, plus Buttons für Registrieren und Anmelden. Kein App-Shell, keine eingeloggten Navigationseinträge.

Leere Zustände überall: ein kurzer Satz in gedämpfter Farbe, darunter höchstens eine Aktion. Keine Illustrationen erfinden.

10. Responsive

Das Mockup existiert nur in einer Breite. Leg diese Abstufung fest und dokumentiere sie im ADR:

ab 1920 px: Layout exakt wie beschrieben
1280–1919 px: Inhaltsbreite schrumpft mit, Schrift ×0.75, Raster unverändert
1024–1279 px: Kategorien 4 Spalten, Top Freelancer 3, Freelancer-Auswahl 2
768–1023 px: Kategorien 3 Spalten, alles andere 2; die überstehenden Bilder der Promo-Kacheln rücken in die Karte hinein
unter 768 px: alles einspaltig; Screen 3 stapelt Portrait über Text; die Zeileneinträge auf Screen 4 stapeln Bild über Text; Navigation wird zu einem Menü-Button
Bildradius unter 768 px auf 24 px reduzieren, sonst frisst er kleine Bilder auf

Prüfe jede Seite bei 1920, 1280 und 390 px.

11. Barrierefreiheit

Der Entwurf zeigt keine Fokus- und Hover-Zustände. Ergänze sie: jedes interaktive Element braucht einen sichtbaren Fokusring, Tastaturbedienung muss vollständig funktionieren.

Zwei gemessene Kontrastprobleme, die du bewusst korrigierst:

Gedämpfter Text. Der Mockup-Wert #707070 ergibt auf der Kartenfläche #252B36 nur 2.87:1, auf dem Seitenhintergrund 3.98:1. WCAG AA verlangt 4.5:1. Verwende stattdessen durchgängig #A0A4AB — 5.68:1 auf Karten, 7.88:1 auf dem Hintergrund, gleiche kühle Anmutung.

Weiss auf dem Akzent-Button ergibt 4.07:1 und verfehlt AA für Fliesstext knapp. Weil die Beschriftung fett und 18 px gross ist, gilt sie als Grosstext mit Schwelle 3:1 und ist zulässig. Halte die Buttonschrift deshalb verbindlich bei mindestens 18 px und Bold — Anforderung, nicht Stilfrage.

Weiter: Karten, die als Ganzes anklickbar sind, brauchen ein echtes Linkziel und dürfen nicht als div mit onClick gebaut werden. Bilder bekommen sinnvolle alt-Texte, dekorative Grafiken alt="".

Beide Kontrastabweichungen gehören in den PR-Text.

12. Was du nicht tust
Keine zusätzlichen Farben, Verläufe oder Schlagschatten einführen — Ausnahme ist der Verlauf im Projekt-Banner, der als Lesbarkeitsmassnahme explizit vorgesehen ist
Keine Animationsbibliothek hinzufügen
Keine neuen npm-Abhängigkeiten ohne Rückfrage
Keine Änderungen an Auth-Logik, Datenmodell, Migrationen oder Route-Guards — dieser PR ist visuell plus neue Seiten mit Mock-Daten
Keine bestehenden Tests löschen, um sie grün zu bekommen
Keine Werte aus diesem Dokument stillschweigend anpassen. Wenn ein Mass im Layout nicht aufgeht, halt an und frag nach.

13. Tests
Für jede neue Seite ein Rendering-Test mit Vitest, der prüft, dass die Kernelemente vorhanden sind — Titel, Anzahl Karten, Verlinkung
Für die Sterne-Komponente ein Test über mehrere Werte inklusive 0 und 5
Die bestehenden Playwright-E2E-Tests müssen weiterhin durchlaufen. Wenn dein Umbau Selektoren bricht, passe die Tests an, aber schwäche ihre Aussage nicht ab.
Ein neuer E2E-Test für den Weg Dashboard → Marketing Planung → Freelancer-Detail

14. Dokumentation

Teil desselben PR, nicht später:

docs/adr/006-design-system-dark-theme.md nach dem etablierten Muster (Status, Kontext, geprüfte Alternativen, Entscheidung & Begründung, Risiken). Abzudecken: Dark-only statt Dual-Theme, Inter als Ersatz für Segoe UI, Adobe XD statt Figma inklusive dessen Wartungsmodus, manuelle Übernahme der Tokens, Kontrastkorrektur, Mock-Daten als Zwischenschritt bis Phase C, die festgelegten Breakpoints.
docs/UMSETZUNGSPLAN.md: In Phase A die Zeile zu den Design-Tokens von Figma auf Adobe XD korrigieren und abhaken. Die Zeilen zu Netlify-Deployment und Supabase-Projekt ebenfalls abhaken — beides läuft längst, der Plan hinkt hinterher.
docs/ki-prompts.md: diesen Prompt vollständig eintragen, mit Datum und Werkzeug.
docs/manuelle-schritte.md: Einträge für die transparente Kugelgrafik und die lizenzfreien Bilder, die Timon nachliefern muss.
docs/screenshots/: Screenshots aller umgesetzten Seiten bei 1920 px ablegen. Der Umsetzungsplan verlangt das je Meilenstein, und es füllt später den Hauptteil der Doku.

15. Verifikationsschleife

Vor jedem Commit vollständig durchlaufen, keinen Schritt überspringen:

npm run lint
npm run format:check
npm run test
npm run build
npm run test:e2e

Schlägt etwas fehl, behebst du die Ursache und startest von vorn. Erst wenn alle fünf Schritte grün sind, wird committet.

Zusätzlich: npm run dev starten und jede Seite bei 1920, 1280 und 390 px im Browser prüfen. Beschreibe im PR-Text, was du gesehen hast.

16. Abschluss
Conventional Commits, thematisch getrennt und je Abschnitt einzeln
PR über gh pr create
Im PR-Text: Zusammenfassung, vollständige Liste aller Abweichungen vom Mockup mit Begründung, offene Punkte für Timon (Kugelgrafik, Bilder, fehlende Kontaktaktion auf Screen 3, fehlende Gestaltung für Freelancer-Dashboard und Chats)
Netlify Deploy Preview verlinken, damit Timon ohne lokales Setup prüfen kann

Wenn dir eine Designentscheidung fehlt, die du nicht aus den vier Screens ableiten kannst: halt an und frag nach. Rate nicht.
```

**Rückfragen vor Planbeginn:** Vor der Ausarbeitung des Umsetzungsplans stellten sich zwei
Blockaden heraus, die laut Auftrag selbst ("Wenn dir eine Designentscheidung fehlt... halt an und
frag nach. Rate nicht.") nicht selbst aufgefüllt werden durften:

1. Kein Zugriff auf das Adobe-XD-Mockup selbst (nur die Mass-/Strukturbeschreibung im Prompt) —
   fuer Screen 2 (7 Freelancer-Karten), Screen 3 (Thomas-Wenger-Bio + 3 Projekteintraege) und
   Screen 4 (Auftragsbeschreibung + 3 Teilaufgaben) fehlten woertliche Texte. Nutzerantwort:
   Text direkt im Chat einfuegen (statt Screenshots oder erfundener Platzhalter).
2. Widerspruch zwischen "Thomas / Content Creator" (Home, Top Freelancer) und "Thomas Wenger",
   Fotograf (Screen 3) — Nutzerantwort: zwei verschiedene Personen, beide Datensaetze bleiben
   getrennt.

Der Nutzer lieferte daraufhin den vollstaendigen Textinhalt in einem zweiten Prompt (siehe unten).

Nach Vorlage des Umsetzungsplans (Datei-fuer-Datei-Liste, Commit-Reihenfolge, Uebersetzungsmethode
Pixel→responsives Flow-Layout) stellte der Nutzer zwei weitere Rueckfragen zur Genehmigung:

3. Wohin der Logout-Button (im Mockup nicht vorgesehen, aber bestehende Funktion) gehoert —
   Nutzerantwort: hinter einem Avatar-Popover verstecken (wie im Plan vorgeschlagen).
4. Ob die vier neuen Screens (/marketing-planung, /freelancer/[id], /projekte, /projekte/[id])
   trotz der Anweisung "keine Aenderungen an Route-Guards" (Abschnitt 12) durch Route-Guards
   geschuetzt werden sollen — Nutzerantwort: ja, isProtectedPath() erweitern, auch wenn das
   technisch eine Aenderung an Route-Guards ist. Diese Abweichung von Abschnitt 12 wird hiermit
   dokumentiert.

**Vollständiger Folgeprompt (wörtliche Mockup-Inhalte):**

```
1. Screen 2 — Freelancer-Auswahl

Raster: 4 Spalten. Zeile 1 mit vier Karten, Zeile 2 mit drei. Der vierte Platz der zweiten Zeile bleibt leer.

Das Stern-Abzeichen trägt nur Karte 1 (Hannes) — oben links über dem Portrait, überlappend. Es markiert eine Empfehlung und gehört als boolesches Feld in die Daten, nicht an die Position im Raster.

Alle sieben haben die Rolle Fotograf — im Mockup unverändert in männlicher Form, auch bei Lena, Selin und Nina.

Karte 1 — Hannes (empfohlen, Stern-Abzeichen)
Rolle: Fotograf
Erfahrung: seit 12 Jahren
Beschreibung (vollständig, bricht nicht ab):
Mein Fokus liegt auf Architektur- und Immobilienfotografie klare Linien, natürliches Licht, kein Schnickschnack.

Karte 2 — Lena
Rolle: Fotograf
Erfahrung: seit 8 Jahren
Beschreibung (bricht nach „unkomplizierten" ab):
Ich bin Lena aus Zürich und spezialisiere mich auf Produkt- und E-Commerce-Fotografie. Meine Kunden schätzen saubere Bildwelten, schnelle Lieferung und einen unkomplizierten

Karte 3 — Marco
Rolle: Fotograf
Erfahrung: seit 11 Jahren
Beschreibung (vollständig):
Basler mit Tessiner Wurzeln, spezialisiert auf Corporate- und Event-Fotografie für Unternehmen aus Pharma, Finance und Tech. Ich schaffe Bildwelten, die zur Marke passen.

Karte 4 — Selin
Rolle: Fotograf
Erfahrung: seit 5 Jahren
Beschreibung (bricht nach „das ist mein" ab):
Ich bin Selin aus Bern und mein Fokus liegt auf People-Fotografie. Portraits, Team-Shootings und echte Emotionen. Menschen so zu zeigen wie sie wirklich sind, das ist mein

Karte 5 — Dominic
Rolle: Fotograf
Erfahrung: seit 15 Jahren
Beschreibung (bricht nach „Restaurantguides" ab):
Food- und Gastronomiefotograf ich verstehe das Handwerk hinter gutem Essen und übersetze es ins Bild. Mehrere meiner Kunden haben seither Eingang in Restaurantguides

Karte 6 — Nina
Rolle: Fotograf
Erfahrung: seit 3 Jahren
Beschreibung (bricht nach „liefere direkt" ab):
Ausgebildet an der Schule für Gestaltung St. Gallen, spezialisiert auf Social-Media-Content und Lifestyle-Fotografie. Ich denke von Anfang an in Formaten und liefere direkt

Karte 7 — Thomas
Rolle: Fotograf
Erfahrung: seit 22 Jahren
Beschreibung (vollständig):
Ich arbeite seit über zwei Jahrzehnten für KMU in der Deutschschweiz — verlässlich, erfahren, ohne Agentur-Overhead. Ein starkes Bild braucht keine Erklärung.

Wichtig zu den Abbrüchen: Bei Lena, Selin, Dominic und Nina bricht der Text mitten im Satz ab, weil die Karte ihn abschneidet — der Volltext existiert im Mockup nicht. Speichere in den Mock-Daten genau diese Zeichenketten. Das Abschneiden im UI passiert zusätzlich über line-clamp-5; die Datenlage bleibt damit ehrlich unvollständig, und in Phase C liefert die Datenbank vollständige Texte nach.

2. Screen 3 — Thomas Wenger
Name: Thomas Wenger
Untertitel: Fotograf seit 22 Jahren

Biografie
Ich habe vor über zwei Jahrzehnten als Fotograf für Lokalzeitungen angefangen und seither jeden grossen Wandel der Branche hautnah miterlebt — von analog zu digital, von Print zu Social Media. Heute arbeite ich ausschliesslich als Freelancer für KMU in der Deutschschweiz, die professionelle Bildwelten brauchen, ohne eine teure Agentur dazwischenzuschalten. Mein Schwerpunkt liegt auf Unternehmens-, Produkt- und Mitarbeiterfotografie — also allem, was ein Unternehmen nach aussen sichtbar macht. Ich lege grossen Wert darauf, meine Kunden vor dem Shooting wirklich zu verstehen: ihre Branche, ihre Werte und das Bild, das sie von sich vermitteln wollen. Was mich nach all den Jahren noch immer begeistert, ist der Moment, wenn ein Kunde seine Fotos zum ersten Mal sieht und merkt, dass sie genau das zeigen, was er nie in Worte fassen konnte. Mit mir bekommt man keine austauschbaren Bilder — sondern ein visuelles Fundament, das langfristig trägt.

Bisherige Projekte

Eintrag 1
Titel: Produktshooting - Schweizer Outdoor Ausrüstung
Beschreibung: Freisteller und Lifestyle-Aufnahmen einer neuen Rucksack-Kollektion für den E-Shop und den gedruckten Katalog.
Kommentar: „Schnelle Abwicklung, top Qualität — buchen wir definitiv wieder."
Datum: November 2025
Bewertung: 4 von 5

Eintrag 2
Titel: Neue Website - Steuerberatungskanzlei
Beschreibung: Teamfotos und Büroaufnahmen für den kompletten Website-Relaunch einer Kanzlei mit drei Standorten in der Deutschschweiz.
Kommentar: „Endlich Fotos, bei denen wir selbst finden, dass wir gut aussehen."
Datum: Oktober 2025
Bewertung: 5 von 5

Eintrag 3
Titel: Jahresbericht-Fotografie - Maschinenbau-KMU
Beschreibung: Mitarbeiterportraits und Produktionsaufnahmen für den gedruckten und digitalen Jahresbericht eines Zulieferers aus dem Aargau.
Kommentar: „Professionell, pünktlich und hat Belegschaft auf Anhieb ins Herz geschlossen."
Datum: Januar 2025
Bewertung: 4 von 5

Die Trennung zwischen Titel und Bindestrich ist im Mockup ein einfacher Bindestrich mit Leerzeichen (-), kein Gedankenstrich. Die Gedankenstriche innerhalb der Fliesstexte sind dagegen echte Halbgeviertstriche (—). Beides so übernehmen.

Die Kommentare stehen in deutschen Anführungszeichen „ … ".

3. Screen 4 — Projekt Brack.alltron
Projekttitel: Brack.alltron Mitarbeiter Plattform erstellen

Auftragsbeschreibung (zweizeilig im Mockup, inhaltlich ein Satz):
Auftrag: Eine Webseite für die Brack.Alltron Mitarbeiter wo interne Nachrichten wie auch ein digitales Telefonbuch geführt wird für welches neue Fotos von den Mitarbeiter braucht.

Teilaufgaben

Fortschrittsbalken ausgemessen: Spur 484 px breit, Füllung in Weiss, Spur in #252B36.

Teilaufgabe 1
Titel: Webseite erstellen
Fortschritt: 41 % (197 von 484 px)
Freelancer: Lukas, Rolle Webprogramierer
Betrag: CHF 4'000
Frist: Bis 24. November 2026
Letzte Nachricht: "Ich habe jetzt die Domain lizensiert, hier ist die Rechnung"

Teilaufgabe 2
Titel: Mitarbeiter fotografiern
Fortschritt: 87 % (420 von 484 px)
Freelancer: Hannes, Rolle Fotograf
Betrag: CHF 1'500
Frist: Bis 24. November 2026
Letzte Nachricht: "Ich habe die Fotos ausgewertet und werde sie jetzt final bearbeiten"

Teilaufgabe 3
Titel: Mockup designen
Fortschritt: 100 % (484 von 484 px)
Freelancer: Thomas, Rolle Web Designer
Betrag: CHF 1'800
Frist: Bis 20. August 2026
Letzte Nachricht: "Schön das Ihnen das Mockup so gefällt, ich leite es weiter an Lukas für die Umsetzung"

Die Metazeile lautet im Mockup: Name, Leerzeichen, Rolle, dann • als Trenner, Betrag, •, Frist. Beispiel: Lukas Webprogramierer • CHF 4'000 • Bis 24. November 2026

Die Beträge verwenden ein typografisches Hochkomma ' (U+2019) als Tausendertrennzeichen, nicht das gerade Apostroph. Die letzten Nachrichten stehen in englischen Anführungszeichen " … " — anders als die Kommentare auf Screen 3.

4. Weitere Texte aus Screen 1

Der Vollständigkeit halber, damit alles an einem Ort liegt:

Navigation: Home · Marketing Planung · Projekte · Chats
Hero Zeile 1: Ihr Marketing
Hero Zeile 2: Effizient gestalten
Untertitel: In wenigen Schritten zur Lösung
Kachel links: Titel Produkt Promoten, Text Produkt in der Praxis vermarkten, Button Plan erstellen
Kachel rechts: Titel Marke Promoten, Text Gestalte wie der Markt deine Marke sieht, Button Plan erstellen
Abschnittslabel: Freelancer-Kategorien
Kategorien: Videografie · Webprogrammierung · Fotografie · Content Creation · Print Grafik · Web Grafik
Abschnittslabel: Top Freelancer
Top Freelancer: Anna / Web Grafikerin · Thomas / Content Creator · Hannes / Fotograf · Matthäus / Videograf · Melina / Grafikerin Print

Alle fünf Top-Freelancer-Karten tragen das Stern-Abzeichen.

Screen 2 Titel: Wählen Sie einen passenden Freelancer aus

Screen 2 Einleitung:
Für ihr Produkt haben wir folgenden Plan und der eine Teil braucht dafür Bilder darum such dir hier einen Fotograf:in Freelancer aus welche:r Ihnen passt.

Seitentitel Screen 3: Auswahl · Seitentitel Screen 4: Projekte
Abschnittsüberschriften: Bisherige Projekte · Teilaufgaben

5. Fehler im Mockup — Entscheidung nötig

Diese Stellen sind sachlich falsch. Sie stehen oben trotzdem wortgetreu, damit die Umsetzung zunächst dem Entwurf entspricht. Für eine benotete Schularbeit sollten sie vor der Abgabe korrigiert werden — die Screenshots landen in der Dokumentation.

Stelle    Im Mockup    Korrekt
Teilaufgabe 2, Titel    Mitarbeiter fotografiern    Mitarbeiter fotografieren
Teilaufgabe 1, Rolle    Webprogramierer    Webprogrammierer
Teilaufgabe 3, Nachricht    Schön das Ihnen    Schön, dass Ihnen
Projekttitel vs. Beschreibung    Brack.alltron / Brack.Alltron    eine Schreibweise wählen
Screen 2, Einleitung    Sehr langer Satz, Mischung aus „Sie" und „dir", Fotograf:in und welche:r    neu formulieren, Anrede vereinheitlichen
Screen 3 vs. Screen 4    „ … " gegen " … "    eine Konvention, empfohlen „ … "
Rollenbezeichnung    Lena, Selin, Nina als Fotograf    Fotografin oder durchgehend neutral
Kategorien    Print Grafik, Web Grafik    prüfen, ob getrennt gewünscht

Zusätzlich: die Auftragsbeschreibung auf Screen 4 ist grammatikalisch kaputt („für welches neue Fotos von den Mitarbeiter braucht"). Als Platzhaltertext im Prototyp unkritisch, in einem Dokumentations-Screenshot fällt es auf.

Empfehlung: Setze die Screens zunächst wortgetreu um, damit sich Umsetzung und Entwurf vergleichen lassen. Sammle die Korrekturen in einem eigenen Issue und fahre sie in einem separaten Commit nach, bevor die Screenshots für die Dokumentation entstehen. So bleibt in der Commit-Historie nachvollziehbar, dass die Fehler erkannt und behoben wurden — das ist für die IDPA-Bewertung mehr wert als ein von Anfang an stillschweigend korrigierter Text.
```

**Anmerkung zur tatsächlichen Ausführung:** Der Umsetzungsplan wurde vor Codebeginn vollständig
vorgelegt und vom Nutzer mit den beiden oben genannten Antworten (Logout-Platzierung,
Route-Guard-Erweiterung) freigegeben. Umgesetzt in 22 Commits auf `feature/mockup-umsetzung`
(Design-Tokens → UI-Basis → Typografie → AppShell → Route-Guards → Mock-Daten → gemeinsame
Bausteine → die vier Screens einzeln → neuer E2E-Test → Auth-/Onboarding-Restyling →
Freelancer-Dashboard → öffentliche Startseite → separater Korrektur-Commit für die
Mockup-Textfehler → Dokumentation). Vor jedem Commit lief die fünfstufige Verifikationsschleife
(lint, format:check, test, build, test:e2e) vollständig grün. Der bestehende E2E-Test
(`e2e/auth-flow.spec.ts`) brach durch das neue Freelancer-Dashboard an zwei Stellen und wurde
angepasst, ohne seine Aussage abzuschwächen — Details siehe die Commit-Beschreibung von
`feat(dashboard-freelancer)` und den PR-Text. Details zu allen weiteren getroffenen Entscheidungen
(CTA-Zielrouten, Logout-Verhalten, leere Zustände, Screen-4-Übersichts-Adaption) stehen in
`docs/adr/006-design-system-dark-theme.md` und im PR-Text.
