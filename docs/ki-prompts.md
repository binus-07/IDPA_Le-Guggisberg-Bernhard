# KI-Prompt-Protokoll

Vollständige Sammlung aller Prompts, mit denen KI-Tools zur Umsetzung dieses Projekts eingesetzt
wurden (Pflicht laut Wegleitung — vollständige Prompts gehören in den Anhang, KI-Nutzung ist als
Quelle zu erfassen). Der volle Prompt-Text steht jeweils im Abschnitt unterhalb der Tabelle.

| Datum      | Tool                          | Zweck                                                             | Prompt                                        |
| ---------- | ----------------------------- | ----------------------------------------------------------------- | --------------------------------------------- |
| 2026-08-09 | Claude Code (claude-sonnet-5) | Phase A Fundament: Next.js/Supabase/Netlify-Grundgerüst aufsetzen | [siehe unten](#2026-08-09--phase-a-fundament) |

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
