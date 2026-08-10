# ADR 003: Authentifizierung — Supabase Auth

**Status:** entschieden

**Kontext:**

Phase B braucht Registrierung, Login, Passwort-Reset und eine Session, die sowohl in Server
Components/Actions als auch im Proxy (Routen-Schutz) verfügbar ist. Wir nutzen bereits Supabase
als Datenbank (ADR 002 aus Phase A) und haben die Clients/Proxy-Grundgerüst aus Phase A bereits
für `@supabase/ssr` gebaut.

**Geprüfte Alternativen:**

- **Supabase Auth (gewählt).** Vorteile: läuft direkt auf der Postgres-Instanz, die wir ohnehin
  nutzen — `auth.uid()` steht in RLS-Policies ohne zusätzliche Integration zur Verfügung (siehe
  ADR 004), E-Mail/Passwort- und Passwort-Reset-Flows sind fertig (`signUp`, `signInWithPassword`,
  `resetPasswordForEmail`, `verifyOtp`), die bereits bestehenden `@supabase/ssr`-Clients aus
  Phase A passen direkt. Nachteile: Auth-Logik ist an Supabase als Anbieter gebunden (Vendor-Lock-in);
  Fehlermeldungen kommen als Codes, die wir selbst übersetzen müssen (siehe
  `src/lib/auth/error-messages.ts`); der Standard-Mailversand ist nur für Tests geeignet und
  muss für den echten Betrieb durch eigenes SMTP ersetzt werden (siehe
  `docs/manuelle-schritte.md`).

- **NextAuth.js / Auth.js.** Vorteile: Next.js-natives, providerunabhängiges Framework, sehr
  verbreitet, viele OAuth-Provider vorkonfiguriert. Nachteile: würde eine zweite
  Nutzer:innen-/Session-Quelle neben der Datenbank einführen — die Verknüpfung zu `auth.uid()`
  in RLS-Policies (unser zentrales Sicherheitsmodell, ADR 004) müssten wir manuell nachbauen,
  z. B. über eine Adapter-Tabelle. Das verdoppelt Komplexität ohne Mehrwert, da wir sowieso auf
  Supabase-Postgres sitzen.

- **Eigenbau (eigene `users`-Tabelle, Passwort-Hashing, Session-Cookies von Hand).** Vorteile:
  keine Abhängigkeit von einem Auth-Anbieter, volle Kontrolle. Nachteile: Passwort-Hashing,
  Session-Rotation, Token-Ablauf, Rate-Limiting und E-Mail-Versand selbst korrekt und sicher zu
  bauen ist für ein Schulprojekt mit engem Zeitrahmen ein unverhältnismässiges Risiko — genau die
  Art Sicherheitscode, bei der Fehler am teuersten sind.

**Entscheidung & Begründung:**

Supabase Auth, weiterhin über die `@supabase/ssr`-Clients aus Phase A. Der entscheidende Vorteil
ist die direkte Verzahnung mit RLS: `auth.uid()` ist in jeder Policy verfügbar, ohne dass wir
Identitäten zwischen zwei Systemen synchronisieren müssen.

**Risiken / Nachteile:**

- Vendor-Lock-in: ein Wechsel des Auth-Anbieters würde RLS-Policies, Server-Actions und den Proxy
  gleichermassen betreffen.
- Der lokale Dev-Mailfang (Mailpit) und der Produktions-Mailversand verhalten sich unterschiedlich
  (siehe `supabase/config.toml`: `enable_confirmations = false` lokal, `true` in Produktion) —
  das ist bewusst so, muss aber im Team bekannt sein, sonst wirkt lokales Testen "zu einfach".
- Passwort-Reset-Flows sind pro Supabase-Version leicht unterschiedlich implementiert (PKCE/OTP);
  die genaue API (`verifyOtp` mit `token_hash`) wurde gegen die installierte Version geprüft,
  nicht aus dem Gedächtnis übernommen — künftige Supabase-Updates sollten hier gegengeprüft werden.
