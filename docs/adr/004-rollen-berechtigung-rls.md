# ADR 004: Rollen- und Berechtigungsmodell — Row Level Security in der Datenbank

**Status:** entschieden

**Kontext:**

Ab Phase B gibt es zwei Rollen (`unternehmen`, `freelancer`) mit unterschiedlichen Rechten auf
`profiles`, und ab Phase C werden weitere Tabellen mit eigentümerbezogenen Daten dazukommen. Wir
müssen entscheiden, WO durchgesetzt wird, wer welche Zeile lesen/schreiben darf.

**Geprüfte Alternativen:**

- **Row Level Security (RLS) direkt in Postgres (gewählt).** Vorteile: Die Datenbank verweigert
  unerlaubten Zugriff unabhängig davon, über welchen Weg zugegriffen wird (App-Code, Supabase
  Studio, ein zukünftiger zweiter Client, ein Bug in der Applikationsschicht) — die Regel kann an
  genau einer Stelle nicht "vergessen" werden. Nachteile: SQL-Policies sind für Teammitglieder
  ohne SQL-Erfahrung schwerer zu lesen als ein `if`-Statement in TypeScript; Fehler in einer
  Policy sind schwerer zu debuggen als ein Anwendungsfehler (kein Stacktrace, nur "0 rows" oder
  "permission denied"). Ausserdem braucht Postgres zusätzlich zu den Policies noch explizite
  Tabellen-`GRANT`s — das haben wir in Phase B selbst erst gemerkt, als der lokale RLS-Test mit
  "permission denied for table profiles" fehlschlug, obwohl die Policies korrekt waren (siehe
  Commit-Historie).

- **Nur Prüfung in der Applikationsschicht** (jede Server Action/jeder Route Handler prüft
  `auth.uid()` gegen die angefragte Zeile selbst, RLS bleibt aus). Vorteile: Logik bleibt in
  TypeScript, für das ganze Team einheitlich lesbar. Nachteile: Die Prüfung muss an JEDER Stelle,
  die auf die Tabelle zugreift, korrekt wiederholt werden — ein einziger vergessener Check (z. B.
  in einem später hinzugefügten Debug-Endpoint) öffnet die Tabelle komplett. Genau dieses Risiko
  nennt der Auftrag explizit ("auch dann durchsetzen, wenn die Applikationsschicht einen Fehler
  hat") — mit RLS aus ist das nicht erreichbar.

- **Beides parallel, RLS nur als loses Sicherheitsnetz.** Vorteile: höchste Sicherheit durch
  Redundanz. Nachteile: doppelte Pflege derselben Regel an zwei Stellen, die bei einer Änderung
  leicht auseinanderlaufen (App erlaubt, was RLS verbietet, oder umgekehrt — verwirrende Fehler).

**Entscheidung & Begründung:**

RLS ist die verbindliche, einzige Durchsetzungsebene für Datenzugriff. Die Applikationsschicht
(Server Actions, Route-Guard in `src/proxy.ts` und `src/lib/auth/server-guard.ts`) übernimmt
zusätzlich die UX-Seite — freundliche Redirects statt kryptischer Datenbankfehler — ist aber
explizit **keine** Sicherheitsgrenze (das steht so auch in den proxy.ts-Kommentaren, mit Verweis
auf die offizielle Next.js-Proxy-Dokumentation). Jede Tabelle bekommt: eine SELECT-Policy für
"eigene und veröffentlichte fremde Zeilen", eine UPDATE-Policy für "nur eigene Zeilen", keine
INSERT-Policy, wo die Zeile stattdessen automatisch per Trigger entsteht (wie bei `profiles`),
und keine Policy für `anon` überhaupt.

**Risiken / Nachteile:**

- Migrationen mit RLS-Policies sind schwerer zu testen als reiner Anwendungscode; wir verlassen
  uns auf den lokalen Supabase-Stack (`supabase start`) für echte Verifikation, nicht nur auf
  gelesenen SQL-Text.
- Tabellen-Grants und Policies sind zwei getrennte Postgres-Mechanismen, die beide korrekt gesetzt
  sein müssen — ein leicht zu übersehendes Detail, das wir in Phase B live erlebt haben (siehe
  Migration `20260810080446_profiles_und_rollen.sql`, `grant select, update ... to authenticated`).
- Neue Teammitglieder müssen genug SQL verstehen, um Policies zu lesen und zu erweitern.
