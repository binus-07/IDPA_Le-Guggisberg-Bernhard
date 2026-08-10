# IDPA Marketing-Freelancer-Plattform

Webplattform, die Unternehmen mit Marketing-Freelancern zusammenbringt. Schulprojekt (IDPA,
Berufsmaturität Schweiz).

Der vollständige Umsetzungsplan (Phasen, Rollen, Dokumentationsprozess) liegt in
[`docs/UMSETZUNGSPLAN.md`](docs/UMSETZUNGSPLAN.md). Architekturentscheidungen sind als ADRs in
[`docs/adr/`](docs/adr) dokumentiert, das Datenmodell in [`docs/datenmodell.md`](docs/datenmodell.md).

## Stack

| Bereich      | Technologie                                                |
| ------------ | ---------------------------------------------------------- |
| Framework    | [Next.js](https://nextjs.org) (App Router, TypeScript)     |
| UI           | Tailwind CSS + [shadcn/ui](https://ui.shadcn.com)          |
| Backend      | [Supabase](https://supabase.com) (Auth, Postgres, Storage) |
| Hosting      | [Netlify](https://netlify.com)                             |
| Tests        | [Vitest](https://vitest.dev) + Testing Library             |
| Formatierung | ESLint + Prettier                                          |

## Setup (lokal, < 10 Minuten)

Voraussetzung: [Node.js](https://nodejs.org) 20 oder neuer, npm.

1. **Repo klonen und Abhängigkeiten installieren**

   ```bash
   git clone https://github.com/binus-07/IDPA_Le-Guggisberg-Bernhard.git
   cd IDPA_Le-Guggisberg-Bernhard
   npm install
   ```

2. **Umgebungsvariablen anlegen**

   ```bash
   cp .env.example .env.local
   ```

   Trage in `.env.local` die Werte deines Supabase-Projekts ein (`NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`). Falls noch kein Supabase-Projekt existiert, siehe
   [`docs/manuelle-schritte.md`](docs/manuelle-schritte.md) — die App läuft auch ohne (der
   Health-Check meldet dann `supabase: false`).

3. **Dev-Server starten**

   ```bash
   npm run dev
   ```

   Die Seite läuft unter [http://localhost:3000](http://localhost:3000), der Verbindungsstatus
   zu Supabase unter [http://localhost:3000/api/health](http://localhost:3000/api/health).

4. **Vor jedem Commit lokal verifizieren** (siehe auch CI/PR-Checks):

   ```bash
   npx tsc --noEmit && npm run lint && npm run build && npm run test
   ```

## Lokale Supabase-Instanz & Migrationen

Für Arbeiten an Datenbank/RLS/Auth (Migrationen schreiben, RLS-Policies testen, E2E-Tests) läuft
eine komplette Supabase-Instanz lokal in Docker — keine echten Daten, jederzeit zurücksetzbar.
Voraussetzung: [Docker Desktop](https://www.docker.com/products/docker-desktop/) läuft.

```bash
npx supabase start   # laedt beim ersten Mal Docker-Images, danach schnell
npx supabase status  # zeigt lokale URL, Keys, Studio-Link (http://127.0.0.1:54323)
npx supabase stop    # wieder herunterfahren
```

`npx supabase start` wendet alle Migrationen aus `supabase/migrations/` automatisch an. Neue
Migration anlegen:

```bash
npx supabase migration new <beschreibung>   # legt Datei mit Zeitstempel-Praefix an
npx supabase db reset                       # alle Migrationen von Grund auf neu anwenden
```

Um die App lokal gegen diese Instanz statt gegen das echte Supabase-Projekt laufen zu lassen,
`NEXT_PUBLIC_SUPABASE_URL` und `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` aus `npx supabase status`
in `.env.local` eintragen (temporär — für den normalen Produktions-Bezug wieder zurücktauschen).

## E2E-Tests

Playwright-Tests laufen bewusst gegen die **lokale** Supabase-Instanz (nie gegen das echte
Projekt, damit keine Test-Accounts dort landen). `playwright.config.ts` liest die lokalen
Zugangsdaten automatisch über `supabase status`.

```bash
npx supabase start          # falls noch nicht gestartet
npx playwright install      # einmalig: Browser-Binaries herunterladen
npm run test:e2e
```

Der Playwright-Testlauf startet den Dev-Server selbst (`webServer` in `playwright.config.ts`)
und stoppt ihn danach wieder.

## Scripts

| Befehl                 | Zweck                                                  |
| ---------------------- | ------------------------------------------------------ |
| `npm run dev`          | Entwicklungsserver mit Hot Reload                      |
| `npm run build`        | Produktions-Build (inkl. TypeScript-Check)             |
| `npm run start`        | Gebauten Produktions-Build lokal starten               |
| `npm run lint`         | ESLint über das Projekt laufen lassen                  |
| `npm run format`       | Code mit Prettier formatieren (schreibt Dateien)       |
| `npm run format:check` | Prettier-Formatierung prüfen, ohne zu schreiben        |
| `npm run test`         | Vitest-Testsuite einmalig ausführen                    |
| `npm run test:e2e`     | Playwright-E2E-Tests gegen die lokale Supabase-Instanz |
| `npx tsc --noEmit`     | Nur TypeScript-Typen prüfen, ohne zu bauen             |

## Projektstruktur

```
├── docs/                  # Umsetzungsplan, ADRs, Datenmodell, KI-Prompt-Protokoll, manuelle Schritte
│   ├── adr/                # Architecture Decision Records
│   ├── datenmodell.md      # ER-Diagramm + Tabellen-/Policy-Erklärungen
│   └── UMSETZUNGSPLAN.md
├── e2e/                    # Playwright-E2E-Tests
├── src/
│   ├── app/                # App Router: Routen, Layouts, API-Routes
│   ├── components/ui/      # shadcn/ui-Komponenten
│   ├── lib/auth/           # Rollen-Guard, Validierung, Fehlerübersetzung, Server Actions
│   ├── lib/supabase/       # Supabase Browser- und Server-Clients
│   └── proxy.ts            # Next.js Proxy (Session-Refresh + Rollen-Guard, vormals middleware.ts)
├── supabase/
│   ├── config.toml          # Konfiguration der lokalen Supabase-Instanz
│   └── migrations/          # Versionierte SQL-Migrationen
├── netlify.toml            # Netlify-Build-Konfiguration
└── playwright.config.ts    # Playwright-Konfiguration (E2E, gegen lokale Supabase-Instanz)
```

## Team

Linus & Floris (Applikationsentwicklung), Timon (Mediamatik / Design). Details zur
Rollenverteilung in [`docs/UMSETZUNGSPLAN.md`](docs/UMSETZUNGSPLAN.md#4-rollenverteilung-vorschlag-im-team-fixieren).
