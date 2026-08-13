import Link from "next/link";
import { BildKarte } from "@/components/bild-karte";
import { Button } from "@/components/ui/button";
import { Kugel } from "@/components/kugel";
import { getKategorien } from "@/lib/mock/kategorien";

export default function Home() {
  const kategorien = getKategorien();

  return (
    <div className="relative flex flex-1 flex-col">
      <Kugel />
      <div className="relative z-[1] mx-auto flex w-full max-w-[1680px] flex-col gap-24 px-6 pt-16 pb-24 md:px-10 lg:px-16 xl:px-[131px]">
        <section className="flex flex-col gap-8">
          <h1 className="text-display leading-[1.49] text-foreground">
            <span className="block">Marketing-Freelancer</span>
            <span className="block">einfach finden</span>
          </h1>
          <p className="text-lead max-w-xl text-foreground">
            Unternehmen und Freelancer der Marketingbranche an einem Ort.
          </p>
          <p className="text-body-light max-w-2xl text-foreground">
            Unternehmen finden hier gezielt Freelancer:innen für Fotografie, Grafik, Content
            Creation und mehr. Freelancer präsentieren ihr Portfolio und erhalten passende Anfragen
            – ohne Umwege über eine Agentur.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/registrieren">Registrieren</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/anmelden">Anmelden</Link>
            </Button>
          </div>
        </section>

        <section className="flex flex-col gap-8">
          <h2 className="text-section-label text-foreground">Freelancer-Kategorien</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {kategorien.map((kategorie) => (
              <BildKarte key={kategorie.id} label={kategorie.name} bildAlt="" />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
