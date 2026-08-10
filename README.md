# IDPA Marketing-Freelancer-Plattform

Webplattform, die Unternehmen mit Marketing-Freelancern zusammenbringt. Schulprojekt (IDPA,
Berufsmaturität Schweiz).

Der vollständige Umsetzungsplan (Phasen, Rollen, Dokumentationsprozess) liegt in
[`docs/UMSETZUNGSPLAN.md`](docs/UMSETZUNGSPLAN.md). Architekturentscheidungen sind als ADRs in
[`docs/adr/`](docs/adr) dokumentiert.

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

## Scripts

| Befehl                 | Zweck                                            |
| ---------------------- | ------------------------------------------------ |
| `npm run dev`          | Entwicklungsserver mit Hot Reload                |
| `npm run build`        | Produktions-Build (inkl. TypeScript-Check)       |
| `npm run start`        | Gebauten Produktions-Build lokal starten         |
| `npm run lint`         | ESLint über das Projekt laufen lassen            |
| `npm run format`       | Code mit Prettier formatieren (schreibt Dateien) |
| `npm run format:check` | Prettier-Formatierung prüfen, ohne zu schreiben  |
| `npm run test`         | Vitest-Testsuite einmalig ausführen              |
| `npx tsc --noEmit`     | Nur TypeScript-Typen prüfen, ohne zu bauen       |

## Projektstruktur

```
├── docs/                  # Umsetzungsplan, ADRs, KI-Prompt-Protokoll, manuelle Schritte
│   ├── adr/                # Architecture Decision Records
│   └── UMSETZUNGSPLAN.md
├── src/
│   ├── app/                # App Router: Routen, Layouts, API-Routes
│   ├── lib/supabase/       # Supabase Browser- und Server-Clients
│   └── proxy.ts            # Next.js Proxy (Session-Refresh, vormals middleware.ts)
├── supabase/migrations/    # Versionierte SQL-Migrationen
└── netlify.toml            # Netlify-Build-Konfiguration
```

## Team

Linus & Floris (Applikationsentwicklung), Timon (Mediamatik / Design). Details zur
Rollenverteilung in [`docs/UMSETZUNGSPLAN.md`](docs/UMSETZUNGSPLAN.md#4-rollenverteilung-vorschlag-im-team-fixieren).
