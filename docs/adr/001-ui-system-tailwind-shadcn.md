# ADR 001: UI-System — Tailwind CSS + shadcn/ui

**Status:** entschieden

**Kontext:**

Wir brauchen ein UI-System für Phase A, mit dem drei Personen (zwei Applikationsentwicklung,
eine Person Mediamatik/Design) konsistent und schnell Oberflächen bauen können. Die Plattform
braucht ab Phase C/D wiederkehrende, aber nicht triviale Komponenten (Formulare, Filter,
Vergleichsansichten, Chat), und Timon soll Design-Tokens aus Figma (Anton/Inter, 8px-Radius)
direkt technisch umsetzbar vorfinden, ohne dass jede Komponente von Grund auf gebaut werden muss.

**Geprüfte Alternativen:**

- **Tailwind CSS + shadcn/ui (gewählt).** Utility-First-CSS kombiniert mit
  kopierbaren, nicht in einer Library versteckten Komponenten (Radix-Primitives + eigener Code
  im Repo). Vorteile: volle Kontrolle über generierten Code, keine Laufzeit-Abhängigkeit von
  einer Komponentenbibliothek mit eigenem Versionszyklus, sehr gute Doku, Tailwind v4 unterstützt
  CSS-Variablen als Design-Tokens nativ (`@theme`), was genau zu unserem Anforderung
  "Design-Tokens als CSS-Variablen" passt. Nachteile: Tailwind-Klassen im Markup sind für
  Einsteiger:innen zunächst unübersichtlich ("Divitis"/Klassenwust), shadcn/ui-Komponenten
  landen als Code im eigenen Repo und müssen bei Bugs/Updates selbst gepflegt werden (kein
  `npm update` für die Komponenten selbst).

- **Chakra UI / Mantine (klassische Komponentenbibliothek).** Vorteile: sehr schnell startklar,
  fertige, barrierefreie Komponenten, wenig Setup. Nachteile: eigenes Styling-System (Emotion/CSS-in-JS
  oder eigene Theme-API) statt Utility-CSS, dadurch schwerer mit den eigenen Design-Tokens
  (Anton/Inter/8px) exakt deckungsgleich zu halten; Anpassungen über die vorgegebene Theme-API
  hinaus sind mühsamer als bei kopierbaren Komponenten; zusätzliche Laufzeit-Abhängigkeit.

- **Plain CSS / CSS Modules ohne Komponentenbibliothek.** Vorteile: keine zusätzliche
  Abhängigkeit, maximale Kontrolle. Nachteile: für drei Personen ohne gemeinsames Vokabular an
  Klassen/Patterns hoher Abstimmungsaufwand, deutlich mehr Boilerplate für Formulare, Dialoge,
  Dropdowns — Zeit, die im engen Zeitrahmen fehlt (siehe Risikotabelle im Umsetzungsplan).

**Entscheidung & Begründung:**

Tailwind CSS + shadcn/ui. Tailwind v4 bildet unsere Design-Tokens (Schriften, Radius, Farben)
direkt als CSS-Variablen im `@theme`-Block ab, wodurch Design und Code eine gemeinsame Quelle
haben. shadcn/ui liefert nur bei Bedarf hinzugefügte, im eigenen Repo liegende Komponenten
(Radix-Primitives für Barrierefreiheit/Verhalten), sodass wir bei Spezialfällen (z. B.
Vergleichsansicht in Phase D) nicht an eine fremde API gebunden sind.

**Risiken / Nachteile:**

- shadcn/ui-Komponenten werden nicht automatisch aktualisiert — Sicherheits-/Bugfixes müssen
  manuell nachgezogen werden (`npx shadcn add <component> --overwrite`).
- Tailwind-lastiges Markup erschwert Timon ggf. den Einstieg ins Code-Review der UI; dem wird mit
  klaren Design-Tokens und wenigen, gut benannten Komponenten begegnet statt mit Utility-Klassen
  auf jeder Seite neu zu improvisieren.
- Die gewählte Preset-Basis (Radix) bindet uns an Radix-Primitives für interaktive Komponenten;
  ein späterer Wechsel der Basis wäre mit Aufwand verbunden, ist aber unwahrscheinlich nötig.
