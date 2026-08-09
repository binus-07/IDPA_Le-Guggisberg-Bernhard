# Umsetzungsplan IDPA – Marketing-Freelancer-Plattform

**Team:** Linus & Floris (Applikationsentwicklung), Timon (Mediamatik / Design)
**Stack (entschieden):** Next.js + TypeScript (App Router) · Supabase · Netlify · GitHub
**Noch offen:** UI-Library (Tailwind/shadcn empfohlen), Zahlung (Stripe Connect), Matching-Logik

> Dieser Plan lebt im Repo unter `/docs/UMSETZUNGSPLAN.md`. Checkboxen abhaken, Änderungen per Commit nachvollziehbar halten – das ist gleichzeitig Material fürs Lernjournal.

---

## 0. Leitplanken (aus Vorgaben & Umfrage abgeleitet)

Aus den ausgewerteten Feedback-E-Mails ergeben sich diese Produkt-Prioritäten:

1. **Muss:** Bewertungssystem, Freelancer-Portfolios, transparente Kosten, einfache/geführte Bedienung (Dropdowns, strukturierte Eingaben), kompakte Profile
2. **Muss:** Hybrides Modell – automatische Vorschläge als Orientierung, finale Auswahl immer durch den Nutzer
3. **Muss:** Strukturiertes Briefing / geführte Auftragserstellung (löst das Problem "fehlender persönlicher Kontakt")
4. **Soll:** Chat, Upload von Referenzen, Vergleichsfunktion
5. **Kann (später):** Zahlungsabwicklung, Provision, Video-Kickoffs, intelligentes Matching

Schulische Leitplanken:

- Lernjournal von Anfang an und wöchentlich führen (fliesst in die Note ein)
- Jede technische Entscheidung mit Alternativen + Begründung dokumentieren
- Alle KI-Prompts sammeln → kommen in den Anhang, KI als Quelle erfassen
- Wettbewerbsanalyse dasauge.de (empfohlen, noch nicht gemacht) → eigenes Doku-Kapitel

---

## 1. Phasenplan

Die Phasen bauen aufeinander auf. Erst wenn das Grundgerüst (Phase A–C) steht, kommen die "spannenden" Features. Datumsangaben tragt ihr im `Vorlage Zeitdiagramm 2025.xlsx` ein und stimmt sie mit euren Coach-Terminen ab.

### Phase A – Fundament (ca. 1–2 Wochen)

- [ ] GitHub-Organisation/Repo anlegen (Struktur siehe Abschnitt 2)
- [ ] Next.js-Projekt mit TypeScript + App Router aufsetzen (`create-next-app`)
- [ ] ESLint + Prettier konfigurieren, damit alle gleich formatieren
- [ ] Netlify mit dem Repo verbinden, erstes Deployment von `main` testen
- [ ] Supabase-Projekt erstellen, Verbindung via `@supabase/ssr` einrichten (Server Components, Cookies, Sessions testen)
- [ ] Entscheidung UI-System treffen (Tailwind + shadcn/ui prüfen) → **ADR schreiben** (siehe Abschnitt 3)
- [ ] Timon: Design-Tokens aus Figma ableiten (Farben, Typografie – Anton für Titel, Inter für Text, 8px-Radius gemäss Mockup)

**Meilenstein A:** "Hello World" läuft deployed auf Netlify und kann Daten aus Supabase lesen.

### Phase B – Auth & Rollen (ca. 1–2 Wochen)

- [ ] Registrierung + Login über Supabase Auth
- [ ] Rollenmodell definieren: `unternehmen`, `freelancer` (evtl. `admin`)
- [ ] Rollenwahl beim Onboarding (kurz halten – Umfrage: "kurzes Onboarding" war explizite Anforderung)
- [ ] Row-Level-Security-Policies für erste Tabellen aufsetzen
- [ ] Geschützte Routen / Middleware (wer sieht was)

**Meilenstein B:** Ein User kann sich registrieren, einloggen und landet je nach Rolle auf dem richtigen Dashboard-Skelett.

### Phase C – Datenmodell & Profile (ca. 2–3 Wochen)

- [ ] Datenmodell finalisieren: `profiles`, `companies`, `freelancers`, `skills`, `portfolio_items`, `projects/briefings`, später `matches`, `messages`, `reviews`
- [ ] ER-Diagramm erstellen → direkt in die Dokumentation übernehmen
- [ ] Freelancer-Profil: Skills, Stundensatz/Kostenrahmen, Portfolio-Upload (Supabase Storage)
- [ ] Unternehmensprofil: Firmendaten, Branche
- [ ] Profile kompakt & strukturiert darstellen (Umfrage-Anforderung)

**Meilenstein C:** Beide Profiltypen können vollständig angelegt, bearbeitet und angezeigt werden.

### Phase D – Suche, Briefing & Vergleich (ca. 2–3 Wochen)

- [ ] Freelancer-Suche mit Filtern (Skills, Kosten, Verfügbarkeit) – Dropdowns statt Freitext
- [ ] Geführter Briefing-Fragebogen für Unternehmen (strukturierte Auftragserfassung)
- [ ] Einfache Vorschlagslogik auf Basis des Briefings (Skill-Matching per Score – kein ML nötig)
- [ ] Vergleichsfunktion: 2–3 Freelancer nebeneinander
- [ ] Kontaktaufnahme / Anfrage senden

**Meilenstein D:** Ein Unternehmen kann ein Briefing erstellen, passende Freelancer finden, vergleichen und anfragen. → **Das ist euer MVP und die Minimalversion für die Abgabe.**

### Phase E – Kommunikation & Vertrauen (ca. 2 Wochen)

- [ ] Chat zwischen Unternehmen und Freelancer (Supabase Realtime)
- [ ] Upload von Referenzdateien im Chat/Briefing
- [ ] Bewertungssystem nach Auftragsabschluss

**Meilenstein E:** Kompletter Flow von Anfrage bis Bewertung funktioniert.

### Phase F – Polish & Reserve (ca. 1–2 Wochen, bewusst als Puffer)

- [ ] Responsive-Feinschliff (Mobile testen)
- [ ] Fehlerbehandlung, leere Zustände, Ladezustände
- [ ] Usability-Test mit 2–3 Aussenstehenden → Ergebnisse dokumentieren (super Material für den Doku-Hauptteil!)
- [ ] Optional, nur bei Zeitreserve: Zahlungs-Mockup oder Stripe-Testmodus

> **Nicht umsetzen** (bewusster Scope-Cut, in der Doku begründen): echte Zahlungsabwicklung mit Provision, Buchhaltung, Video-Calls, komplexes ML-Matching.

### Phase G – Abschluss (parallel zu F, dann exklusiv)

- [ ] Dokumentation fertigstellen (Struktur siehe Abschnitt 3)
- [ ] Abstract zuletzt schreiben
- [ ] Anonymisierte PDF-Version für Plagiatsprüfung (Bilder raus, Namen raus, Dateiname ohne Umlaute)
- [ ] Dateiname: `Namen_Titel_Jahr`
- [ ] Eigenständigkeitserklärung unterschreiben
- [ ] Präsentation vorbereiten (5 Min. pro Person, Ausdruck 3 Folien/Blatt für Coaches)
- [ ] Poster/Material für Ausstellung

---

## 2. Git-Struktur & Arbeitsweise

### Repository-Aufbau

```
idpa-plattform/
├── README.md              # Setup-Anleitung, Stack, Links (Netlify, Supabase)
├── docs/
│   ├── UMSETZUNGSPLAN.md  # dieses Dokument
│   ├── adr/               # Architecture Decision Records (siehe unten)
│   │   ├── 001-hosting-netlify.md
│   │   ├── 002-datenbank-supabase.md
│   │   └── ...
│   ├── datenmodell.md     # ER-Diagramm + Erklärungen
│   └── ki-prompts.md      # laufende Sammlung aller KI-Prompts (Pflicht für Anhang!)
├── src/
│   ├── app/               # App Router: Routen, Layouts, Server Components
│   ├── components/        # wiederverwendbare UI-Komponenten
│   ├── lib/               # Supabase-Clients, Utils, Typen
│   └── ...
├── supabase/
│   └── migrations/        # SQL-Migrationen versioniert (Schema-Änderungen nachvollziehbar!)
└── ...
```

### Branching-Modell (bewusst einfach – GitHub Flow)

- **`main`** = immer deploybar, verbunden mit Netlify-Production
- **Feature-Branches** von `main`: `feature/auth-login`, `feature/freelancer-profil`, `fix/chat-scroll`
- Merge nur per **Pull Request** mit Review durch mindestens ein anderes Teammitglied
- Netlify Deploy Previews pro PR nutzen → Timon kann Design direkt im Preview prüfen, ohne lokal etwas aufzusetzen

Kein `develop`-Branch, kein Git Flow – bei 3 Personen und diesem Zeitrahmen wäre das nur Overhead. (Diese Entscheidung ebenfalls kurz in der Doku begründen.)

### Commit-Konventionen

Format: `typ: kurze beschreibung` – z. B. `feat: freelancer-suche mit skill-filter`, `fix: session-cookie im app router`, `docs: adr für ui-library`, `chore: eslint-setup`.

Warum das für euch doppelt wertvoll ist: Die Commit-Historie ist ein **automatisches Arbeitsprotokoll** – ihr könnt daraus Lernjournal-Einträge rekonstruieren und in der Doku belegen, wer wann was gemacht hat.

### Aufgabenverwaltung

- GitHub **Issues** für jede Aufgabe aus diesem Plan (Labels: `phase-a` … `phase-g`, `frontend`, `backend`, `design`, `doku`)
- Ein **GitHub Project Board** (Spalten: Backlog / In Arbeit / Review / Fertig)
- Issues den Personen zuweisen → klare Verantwortlichkeiten (E-Phase von IPERKA, wird im Lernjournal abgefragt)

---

## 3. Dokumentationsprozess

Die Doku entsteht **parallel**, nicht am Schluss. Drei Instrumente:

### 3.1 Lernjournal (Pflicht, benotet)

- Vorlage der Schule nutzen (`Vorlage Lernjournal.docx`), pro Person geführt
- **Fester Rhythmus: jeden Freitag 15 Minuten** – Arbeiten / Reflexion / Planung in ganzen Sätzen
- Quelle: Commit-Historie + geschlossene Issues der Woche durchscrollen
- Die IPERKA-Reflexionsfragen aus der Wegleitung als Checkliste danebenlegen

### 3.2 Architecture Decision Records (ADRs)

Für jede technische Entscheidung eine kurze Markdown-Datei in `docs/adr/` nach diesem Muster:

```markdown
# ADR 00X: Titel der Entscheidung
**Status:** entschieden | offen
**Kontext:** Welches Problem lösen wir?
**Geprüfte Alternativen:** Option A (Vor-/Nachteile), Option B (…)
**Entscheidung & Begründung:** …
**Risiken / Nachteile:** …
```

Bereits jetzt schreibbar: 001 Netlify statt Vercel, 002 Supabase statt Firebase/MERN, 003 Next.js Fullstack statt separates Backend, 004 kein No-Code. Diese ADRs sind später **fast 1:1 der Technik-Teil eurer Dokumentation** – genau das verlangt die Wegleitung ("Alternativen geprüft, Begründung, Nachteile, offene Punkte").

### 3.3 KI-Prompt-Protokoll (Pflicht!)

- `docs/ki-prompts.md` von Tag 1 an führen: Datum, Tool, vollständiger Prompt, wofür verwendet
- Laut Anleitung müssen die **vollständigen Prompts in den Anhang** und KI-Nutzung als Quelle erfasst werden – nachträglich rekonstruieren ist fast unmöglich, laufend sammeln ist trivial

### 3.4 Doku-Rohbau früh anlegen

Word-Dokument mit der vorgegebenen Struktur schon in Phase A erstellen und laufend füllen:

Titelblatt → Inhaltsverzeichnis → Vorwort → Abstract (zuletzt!) → Einleitung (max. 2 Seiten: Problemstellung, Leitfrage, Ziel) → Hauptteil (Methoden & Vorgehen | Umsetzung des Produkts | Resultate inkl. Fragebogen-Auswertung & Usability-Test | Diskussion) → Schlusswort & Reflexion → Quellen → Anhang (KI-Prompts, Fragebögen, Verträge)

**Wortumfang:** Bei Produktarbeiten mind. 50 % der Theorievorgabe – den genauen Zielwert mit den Coaches absprechen und hier eintragen: ______ Wörter. (Achtung: ±20 % Abweichung gibt Notenabzug.)

**Screenshots sammeln:** Bei jedem Meilenstein Screenshots des aktuellen Stands in `docs/screenshots/` ablegen – zeigt die Entwicklung und füllt den Hauptteil.

---

## 4. Rollenverteilung (Vorschlag, im Team fixieren)

| Bereich | Lead | Support |
|---|---|---|
| Setup, Deployment, Supabase | Linus | Floris |
| Auth, Datenmodell, Backend-Logik | Floris | Linus |
| Design, Figma, UI-Umsetzung, Screenshots | Timon | – |
| Briefing-Flow & Suche | Linus | Timon (UX) |
| Chat & Bewertungen | Floris | – |
| Lernjournal | jede*r selbst | – |
| ADRs / Technik-Doku | wer entscheidet, schreibt | – |
| Wettbewerbsanalyse dasauge.de | Timon | – |

---

## 5. Wöchentlicher Rhythmus

1. **Montag (15 Min.):** Kurzes Stand-up – Board durchgehen, Issues der Woche zuweisen
2. **Unter der Woche:** Feature-Branches, PRs, Reviews
3. **Freitag (30 Min.):** Review der Deploy-Preview, Merge, Lernjournal-Eintrag, Board aufräumen
4. **Vor jedem Coach-Termin:** Zeitdiagramm aktualisieren (Ist vs. Soll), offene Fragen sammeln

---

## 6. Risiken & Gegenmassnahmen

| Risiko | Gegenmassnahme |
|---|---|
| Scope zu gross für den Zeitrahmen | MVP = Meilenstein D; Phasen E/F sind Ausbaustufen. Bei Verzug: Features streichen, nicht Qualität |
| Supabase/SSR-Integration frisst Zeit | In Phase A isoliert testen, bevor Features darauf aufbauen |
| Doku bleibt liegen | ADRs + Lernjournal + Screenshots laufend; Freitags-Ritual ist nicht verhandelbar |
| Ungleiche Arbeitsverteilung | Issues mit Zuweisung, Commit-Historie macht Beiträge sichtbar |
| Wortzahl verfehlt (±20 % = Abzug) | Zielwert mit Coaches klären, ab Phase D monatlich Wortstand prüfen |
