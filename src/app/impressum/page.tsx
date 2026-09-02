import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Impressum – FREELANCE.CH",
};

export default function ImpressumPage() {
  return (
    <div className="mx-auto flex w-full max-w-[800px] flex-col gap-10 px-6 py-16 md:px-10">
      <div>
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Zurück
        </Link>
      </div>

      <h1 className="font-heading text-4xl text-foreground">Impressum</h1>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-foreground">Betreiber</h2>
        <p className="text-foreground/80 leading-relaxed">
          Dieses Projekt wurde im Rahmen der Interdisziplinären Projektarbeit (IDPA) erstellt.
        </p>
        <ul className="flex flex-col gap-1 text-foreground/80">
          <li>Floris Le</li>
          <li>Linus Bernhard</li>
          <li>Timon Guggisberg</li>
        </ul>
        <p className="text-foreground/80">
          Lernende bei der Berufsbildung Baden (BBB)
          <br />
          Wiesenstrasse 32
          <br />
          5400 Baden, Aargau
          <br />
          Schweiz
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-foreground">Zweck</h2>
        <p className="text-foreground/80 leading-relaxed">
          FREELANCE.CH ist eine im Rahmen der IDPA entwickelte, nicht-kommerzielle
          Lernplattform. Sie dient ausschliesslich zu Ausbildungszwecken und stellt keine
          gewerbsmässige Dienstleistung dar.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-foreground">Haftungsausschluss</h2>
        <p className="text-foreground/80 leading-relaxed">
          Die Betreiber übernehmen keine Gewähr für die Richtigkeit, Vollständigkeit oder
          Aktualität der bereitgestellten Inhalte. Haftungsansprüche gegen die Betreiber wegen
          Schäden materieller oder immaterieller Art, die durch die Nutzung oder Nichtnutzung
          der dargebotenen Informationen entstehen, sind grundsätzlich ausgeschlossen.
        </p>
        <p className="text-foreground/80 leading-relaxed">
          Die Betreiber behalten sich das Recht vor, Teile der Website oder die gesamte Website
          ohne gesonderte Ankündigung zu verändern, zu ergänzen oder zu löschen.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-foreground">Urheberrecht</h2>
        <p className="text-foreground/80 leading-relaxed">
          Die auf dieser Website veröffentlichten Inhalte und Werke unterliegen dem Schweizer
          Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung oder jede Art der
          Verwertung ausserhalb der Grenzen des Urheberrechts bedarf der schriftlichen
          Zustimmung der jeweiligen Autoren.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-foreground">Datenschutz</h2>
        <p className="text-foreground/80 leading-relaxed">
          Im Rahmen dieser Lernplattform werden E-Mail-Adresse und Profilinformationen
          gespeichert, die zur Nutzung der Plattform notwendig sind. Die Daten werden nicht an
          Dritte weitergegeben und ausschliesslich im Rahmen des IDPA-Projekts verwendet. Es
          gelten die Bestimmungen des Schweizer Datenschutzgesetzes (DSG).
        </p>
      </section>
    </div>
  );
}
