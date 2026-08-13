# ADR 006: Design-System — Dark-only Theme aus dem Adobe-XD-Mockup

**Status:** entschieden

**Kontext:**

Timon hat das erste vollstaendige Mockup der Plattform in Adobe XD geliefert: vier Screens
(Home/Dashboard, Freelancer-Auswahl, Freelancer-Detail, Projekt-Detail) auf einem 1920px-Artboard,
durchgaengig dunkel gestaltet. Bisher lief die App im shadcn-Standardtheme (hell, mit ungenutztem
`.dark`-Block). Aufgabe war, das Mockup vollstaendig als echte Seiten umzusetzen, alle bereits
gebauten Seiten (Auth, Onboarding, beide Dashboards, oeffentliche Startseite) auf dieselbe
Gestaltung zu ziehen, und dabei mehrere Entscheidungen zu treffen, die im Mockup nicht explizit
geregelt sind.

**Geprüfte Alternativen:**

- **Dark-only (gewählt).** Die App rendert nie hell, es gibt keinen Theme-Switcher und keinen
  `.dark`-Klassenblock. Vorteile: exakt das, was das Mockup zeigt und was der Auftrag ausdruecklich
  verlangt ("Kein Light Mode, kein Theme-Switcher. Diese Entscheidung ist getroffen und nicht zu
  hinterfragen."); kein doppelter Farbsatz zu pflegen; kein Risiko von Kontrastluecken in einem nie
  getesteten zweiten Theme. Nachteile: Nutzer:innen, die ein helles Theme aus Betriebssystem-
  Praeferenz erwarten, bekommen keins — bewusst in Kauf genommen, da explizit gefordert.
- **Dual-Theme (Light + Dark, verworfen).** Waere der uebliche shadcn-Weg gewesen (der `.dark`-Block
  existierte bereits im Fundament aus Phase A). Verworfen, weil der Auftrag das ausdruecklich
  ausschliesst und ein zweites, nie im Mockup entworfenes Theme entweder frei erfunden oder mit
  hohem Zusatzaufwand aus den 5 Mockup-Farben abgeleitet werden muesste, ohne dass es je geprueft
  wird.
- **System-Preference-basiertes Dark-Theme (verworfen).** Technisch nah an Dark-only, aber mit
  `prefers-color-scheme` als Einstiegspunkt fuer ein spaeteres Light-Theme. Verworfen aus demselben
  Grund wie Dual-Theme — es gibt kein Light-Theme, das ausgeliefert werden soll.

**Entscheidung & Begründung:**

_Dark-only._ `src/app/globals.css` enthaelt die 5 Mockup-Farben direkt in `:root`
(Hintergrund #060B13, Flaeche #252B36, Akzent #CC5C3B, Text primaer #FFFFFF, Text gedaempft), keinen
`.dark`-Block, kein `@custom-variant dark` (nach dem Entfernen aller `dark:`-Praefixe aus
button/card/input ungenutzt). `<meta name="color-scheme" content="dark">` sorgt dafuer, dass native
Formularelemente und Scrollbalken mitziehen.

_Inter statt Segoe UI._ Das Mockup nutzt die Windows-Systemschrift Segoe UI, die im Web nicht
verfuegbar/lizenziert ist. Inter (bereits in Phase A als `--font-inter` eingebunden) hat nahezu
identische Metriken und ist die im Auftrag selbst vorgegebene, bewusst gewaehlte Ersatzschrift.

_Adobe XD statt Figma._ ADR 001 (Phase A) ging noch von Figma als Mockup-Quelle aus
("Timon soll Design-Tokens aus Figma... direkt technisch umsetzbar vorfinden"). Tatsaechlich
geliefert wurde ein Adobe-XD-Mockup. Relevanter Unterschied: Adobe XD befindet sich seit 2023 im
Wartungsmodus (keine neuen Features, reduzierter Support durch Adobe) und wird mittelfristig durch
Figma oder ein Nachfolgeprodukt ersetzt werden muessen — fuer diese IDPA ohne Konsequenz (das
Mockup ist fertig, wir exportieren nur noch Assets daraus), aber ein Punkt, den Timon fuer
Folgeprojekte kennen sollte. `docs/UMSETZUNGSPLAN.md` wurde entsprechend korrigiert.

_Manuelle Token-Uebernahme statt automatisiertem Export._ Es gibt kein Figma-MCP/Dev-Mode-Aequivalent
fuer Adobe XD, das an dieses Tooling angebunden ist. Die Farben (inkl. oklch-Werte), Schriftgroessen,
Radien und Abstaende wurden deshalb aus der schriftlichen Mockup-Beschreibung manuell in
CSS-Variablen und Tailwind-Utility-Klassen uebersetzt (`src/app/globals.css`), nicht automatisiert
generiert.

_Kontrastkorrektur._ Zwei im Mockup gemessene Werte unterschreiten WCAG AA und wurden bewusst
korrigiert:

- Gedaempfter Text: Mockup-Wert `#707070` ergibt 2.87:1 auf der Kartenflaeche `#252B36` und
  3.98:1 auf dem Hintergrund `#060B13` — beide unter der AA-Schwelle von 4.5:1 fuer Fliesstext.
  Ersetzt durch `#A0A4AB` (5.68:1 auf Karten, 7.88:1 auf dem Hintergrund), gleiche kuehle
  Anmutung.
- Weiss auf dem Akzent-Button (`#CC5C3B`) ergibt 4.07:1 und verfehlt AA fuer normalen Fliesstext
  (4.5:1), erfuellt aber die 3:1-Schwelle fuer Grosstext. Die Buttonschrift ist deshalb
  verbindlich mindestens 18px und Bold (`text-button`-Rolle in `globals.css`, hartcodiert in
  `button.tsx`, nicht ueber `--fz-scale` reduzierbar) — Anforderung, nicht Stilfrage.

_Destructive-Farbe._ Im Mockup nicht vorhanden (keine Fehlerzustaende gestaltet). Der
shadcn-Dark-Default (`oklch(0.704 0.191 22.216)`) wurde unveraendert uebernommen, da er bereits im
Phase-A-Fundament vorlag und mit dem dunklen Hintergrund ausreichend Kontrast bildet.

_Mock-Daten als Zwischenschritt._ Es existiert noch kein Freelancer-/Projekt-Datenmodell in
Supabase (kommt laut Umsetzungsplan in Phase C). `src/lib/mock/*` liefert bis dahin typisierte,
woertlich aus dem Mockup uebernommene Inhalte ueber Getter-Funktionen (`getFreelancer(id)` etc.),
damit der Austausch gegen echte Supabase-Abfragen in Phase C ein Eingriff an einer Stelle bleibt und
keine Komponente das Array direkt importiert.

_Breakpoints._ Das Mockup existiert nur bei 1920px. Der Auftrag gibt fuer die Skalierung darunter
nur Richtwerte vor (×0.75 bei 1280px, ×0.6 auf Tablet, ×0.5 auf Mobile) fuer fuenf Breakpoint-Stufen
(≥1920 / 1280–1919 / 1024–1279 / 768–1023 / <768). Festgelegt:

- ≥1920px: Layout und Schriftgroessen exakt wie im Mockup vermessen.
- 1280–1919px: Inhaltsbreite schrumpft mit, Schrift ×0.75, Raster unveraendert.
- 1024–1279px: Kategorien 4 Spalten, Top Freelancer 3, Freelancer-Auswahl 2 Spalten — Schrift
  ×0.6 (siehe naechster Punkt).
- 768–1023px: Kategorien 3 Spalten, alles andere 2 Spalten, ueberstehende Bilder der
  Promo-Kacheln ruecken in die Karte hinein, Schrift ×0.6.
- <768px: alles einspaltig, Screen 3 stapelt Portrait ueber Text, Screen-4-Zeilen stapeln Bild
  ueber Text, Navigation wird zum Menue-Button, Schrift ×0.5, Bildradius reduziert auf 24px.

Offengelegte Annahme: der Auftrag nennt nur 3 Multiplikatoren fuer 5 Stufen. ×0.6 wurde fuer
beide "Tablet"-Stufen (768–1279px) angesetzt, da der Fliesstext nur eine Tablet-Stufe erwaehnt.
Als CSS-Variable `--fz-scale` in `globals.css` umgesetzt (mobile-first kaskadiert), bei Bedarf an
einer einzigen Stelle korrigierbar.

Pixel-Koordinaten aus dem Mockup wurden nicht als `position:absolute` uebernommen (das haette die
geforderte Responsivitaet gebrochen). Breiten/Hoehen von Karten, Bildern und Buttons sind bei
≥1920px exakte Fixwerte; x-Positionen wurden zu Flex-/Grid-Anordnung, y-Abstaende zu
Margin/Gap/Line-Height. Unterhalb 1920px werden Grids dort, wo keine neuen Pixelmasse genannt
sind, fluid (`fr`/`%`) statt fix-px.

**Risiken / Nachteile:**

- Die `--fz-scale`-Annahme fuer 768–1279px ist eine Interpretation, keine explizite Vorgabe — falls
  Timon oder das Mockup selbst (bei spaeterer Tablet-Gestaltung) etwas anderes zeigen, muss nur der
  eine Wert in `globals.css` angepasst werden.
- Mock-Daten in `src/lib/mock/*` sind absichtlich unvollstaendig (z. B. abgebrochene
  Freelancer-Beschreibungen, fehlende Bios ausser bei Thomas Wenger) — das bildet den Mockup-Stand
  ehrlich ab, bedeutet aber, dass mehrere Freelancer-Detailseiten bis Phase C nur den leeren
  Zustand zeigen.
- Adobe XD im Wartungsmodus: falls Timon fuer spaetere Screens (Chats, Freelancer-Dashboard) ein
  neues Tool braucht, ist das ein Migrationsaufwand, der ausserhalb dieses PRs liegt.
- Placeholder-Bilder (`PlatzhalterBild`, farbige Flaeche statt echtem Bild) muessen in Phase C oder
  frueher durch lizenzfreie Bilder ersetzt werden (siehe `docs/manuelle-schritte.md`) — bis dahin
  wirken alle Bildkacheln visuell gleich.
