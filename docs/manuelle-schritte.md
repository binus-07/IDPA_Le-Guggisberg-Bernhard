# Manuelle Schritte

Diese Schritte brauchen eine Weboberfläche (Supabase-Dashboard, Netlify-UI) und konnten daher
nicht automatisiert vorbereitet werden. Alles, was sich vorbereiten liess (Code, Konfiguration,
`.env.example`, `netlify.toml`), ist bereits erledigt — hier folgt nur noch, was im Browser
gemacht werden muss.

## 1. Supabase-Projekt erstellen

1. Auf [supabase.com](https://supabase.com) einloggen (oder Account erstellen) und ein neues
   Projekt anlegen. Region: möglichst nah an der Zielgruppe (z. B. Frankfurt/EU).
2. Ein sicheres Datenbank-Passwort setzen und **separat** aufbewahren (Passwort-Manager) — es
   gehört nicht ins Repo.
3. Nach Erstellung des Projekts: **Project Settings → API** öffnen. Dort stehen:
   - **Project URL** → wird zu `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public**-Key → wird zu `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
4. Lokal: `.env.example` nach `.env.local` kopieren (`cp .env.example .env.local`) und die beiden
   Werte eintragen. `.env.local` ist in `.gitignore` und wird nie committet.
5. Verifizieren: `npm run dev` starten und
   [http://localhost:3000/api/health](http://localhost:3000/api/health) aufrufen — Antwort sollte
   `{"status":"ok","supabase":true}` sein.

Hinweis: Bis dieser Schritt gemacht ist, meldet `/api/health` bewusst
`{"status":"error","supabase":false}` statt die App zum Absturz zu bringen (siehe `src/proxy.ts`
und `src/app/api/health/route.ts`).

## 2. Netlify mit dem Repo verbinden

1. Auf [app.netlify.com](https://app.netlify.com) einloggen, **Add new site → Import an existing
   project** wählen und das GitHub-Repo `binus-07/IDPA_Le-Guggisberg-Bernhard` auswählen (GitHub-
   Berechtigung für das Repo ggf. erst erteilen).
2. Netlify erkennt Next.js automatisch über `netlify.toml` (Build-Command `npm run build`,
   `@netlify/plugin-nextjs`-Plugin). Keine manuellen Build-Einstellungen nötig.
3. **Site settings → Environment variables** öffnen und die gleichen zwei Variablen wie lokal
   eintragen:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
4. Production-Branch auf `main` setzen (Standard bei Netlify).
5. **Deploy previews** aktivieren (Site settings → Build & deploy → Deploy contexts), damit jede
   Pull Request automatisch eine Vorschau bekommt — Timon kann Design-Änderungen dann direkt im
   Preview-Link prüfen, ohne lokal etwas aufzusetzen.

## 3. Erstes Deployment prüfen

1. Nach dem Verbinden triggert Netlify automatisch einen Build von `main`.
2. Build-Log auf Fehler prüfen (Site → Deploys → aktuellstes Deployment).
3. Deployte URL öffnen, `/` und `/api/health` aufrufen — gleiche Erwartung wie lokal
   (`/api/health` → `{"status":"ok","supabase":true}`, sobald Schritt 1 erledigt ist).
4. Deployte URL und Supabase-Projektname in `README.md` ergänzen (Platzhalter aktuell noch offen).

## 4. Produktions-SMTP für Supabase Auth einrichten

Der in Supabase standardmässig aktivierte Mailversand ("Built-in Email Service") ist ausdrücklich
nur für Tests gedacht: stark rate-limitiert (wenige Mails pro Stunde) und verschickt aus einer
Supabase-eigenen Adresse, die schnell im Spam landet. Registrierungs-Bestätigung und
Passwort-Reset (`/passwort-vergessen`) funktionieren damit lokal und für einzelne manuelle Tests,
aber nicht für echten Betrieb mit mehreren Nutzer:innen.

1. Einen Transaktions-E-Mail-Dienst wählen (z. B. Resend, Postmark oder SendGrid — alle haben ein
   kostenloses Kontingent, das für ein Schulprojekt reicht).
2. Beim gewählten Dienst ein Konto erstellen, die Absender-Domain verifizieren (DNS-Einträge, die
   der Dienst vorgibt) und SMTP-Zugangsdaten (Host, Port, Benutzername, Passwort) erzeugen.
3. Im Supabase-Dashboard: **Project Settings → Authentication → SMTP Settings** öffnen,
   "Enable Custom SMTP" aktivieren und die Zugangsdaten aus Schritt 2 eintragen. Absenderadresse
   und -name (z. B. `no-reply@<eure-domain>`) setzen.
4. Test-E-Mail über den Dashboard-Button verschicken und im eigenen Postfach prüfen.
5. Optional, aber empfohlen: Unter **Authentication → Email Templates** die Standardtexte (z. B.
   "Reset Password") auf Deutsch anpassen, passend zur deutschsprachigen UI dieser App.

Die SMTP-Zugangsdaten selbst gehören **nicht** ins Repo — sie werden ausschliesslich im
Supabase-Dashboard hinterlegt, nicht in `.env.local`/`.env.example` oder Netlifys
Umgebungsvariablen.

## Offene Punkte nach diesen Schritten

- [x] Supabase-Projekt erstellt und Credentials in `.env.local` (lokal) und Netlify (Produktion)
      hinterlegt
- [x] Netlify mit dem Repo verbunden, `main` deployt
- [x] Deploy Previews für Pull Requests aktiviert
- [x] Live-Verifikation von `/api/health` mit echter Supabase-Verbindung (`supabase: true`)
- [ ] Produktions-SMTP für Supabase Auth eingerichtet (aktuell: Standard-Mailversand, nur für
      Tests geeignet — Registrierung/Login funktionieren, Massenversand an mehrere Nutzer:innen
      nicht)
