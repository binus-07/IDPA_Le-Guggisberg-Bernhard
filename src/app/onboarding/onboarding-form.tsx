"use client";

import { useState, useTransition } from "react";
import { onboarding } from "./actions";

type Rolle = "freelancer" | "unternehmen";

type OnboardingData = {
  rolle: Rolle | null;
  anzeigename: string;
  firmenname: string;
  // Unternehmen
  branche: string | null;
  unternehmensgroesse: string | null;
  gesuchte_leistungen: string[];
  dringlichkeit: string | null;
  // Freelancer
  spezialisierungen: string[];
  branchen_erfahrung: string[];
  erfahrung_jahre: string;
  bio: string;
  verfuegbarkeit: string | null;
  verfuegbar_ab: string;
};

const defaultData: OnboardingData = {
  rolle: null,
  anzeigename: "",
  firmenname: "",
  branche: null,
  unternehmensgroesse: null,
  gesuchte_leistungen: [],
  dringlichkeit: null,
  spezialisierungen: [],
  branchen_erfahrung: [],
  erfahrung_jahre: "",
  bio: "",
  verfuegbarkeit: null,
  verfuegbar_ab: "",
};

// ─── Shared atoms ──────────────────────────────────────────────────────────────

function GlobalSphere() {
  return (
    <div
      aria-hidden="true"
      className="absolute top-0 right-0 w-80 h-80 -mr-24 -mt-24 pointer-events-none z-0"
    >
      <svg
        className="w-full h-full opacity-15"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="dotPattern" width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="6" cy="6" r="2.5" fill="#D95D39" />
          </pattern>
          <radialGradient id="sphereGradient" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
            <stop offset="0%" stopColor="white" stopOpacity="0.2" />
            <stop offset="100%" stopColor="black" stopOpacity="0.8" />
          </radialGradient>
          <mask id="sphereMask">
            <circle cx="100" cy="100" r="100" fill="url(#sphereGradient)" />
          </mask>
        </defs>
        <circle cx="100" cy="100" r="100" fill="url(#dotPattern)" mask="url(#sphereMask)" />
      </svg>
    </div>
  );
}

function OnboardingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-[#0D0F14]/90 backdrop-blur border-b border-[#2D3139] flex items-center px-6 z-50">
      <span className="font-heading text-xl text-[#e2e2e9] tracking-wider uppercase">
        Freelance.ch
      </span>
    </header>
  );
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full max-w-lg mb-8 text-center">
      <span className="text-xs font-semibold tracking-widest uppercase text-[#dfc0b7] block mb-3">
        Schritt {current} von {total}
      </span>
      <div className="w-full h-1 bg-[#2D3139] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#D95D39] rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function NavButtons({
  onNext,
  onBack,
  nextDisabled = false,
  nextLabel = "Weiter",
  skipLabel,
  onSkip,
}: {
  onNext: () => void;
  onBack?: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  skipLabel?: string;
  onSkip?: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 w-full mt-8">
      <button
        onClick={onNext}
        disabled={nextDisabled}
        className={`w-full py-4 px-6 rounded-full font-bold text-sm tracking-wider uppercase transition-colors ${
          nextDisabled
            ? "bg-[#2D3139] text-[#7A7D85] cursor-not-allowed"
            : "bg-[#D95D39] text-white hover:bg-[#c44e2e]"
        }`}
      >
        {nextLabel}
      </button>
      {onBack && (
        <button
          onClick={onBack}
          className="w-full py-4 px-6 rounded-full font-bold text-sm tracking-wider uppercase border border-[#2D3139] text-[#e2e2e9] hover:border-[#D95D39] transition-colors"
        >
          Zurück
        </button>
      )}
      {skipLabel && onSkip && (
        <button
          onClick={onSkip}
          className="w-full py-3 text-sm font-semibold text-[#dfc0b7] hover:text-[#e2e2e9] transition-colors tracking-wide"
        >
          {skipLabel}
        </button>
      )}
    </div>
  );
}

function RadioCard({
  label,
  description,
  selected,
  onSelect,
}: {
  label: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`bg-[#1A1D24] border-2 rounded-xl p-6 text-left w-full transition-all duration-200 focus:outline-none ${
        selected ? "border-[#D95D39]" : "border-[#2D3139] hover:border-[#D95D39]"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="font-semibold text-[#e2e2e9] text-base">{label}</span>
          {description && <p className="text-[#dfc0b7] text-sm mt-1">{description}</p>}
        </div>
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
            selected ? "border-[#D95D39]" : "border-[#2D3139]"
          }`}
        >
          {selected && <div className="w-2.5 h-2.5 rounded-full bg-[#D95D39]" />}
        </div>
      </div>
    </button>
  );
}

function ChipGrid({
  options,
  selected,
  onToggle,
  icons,
}: {
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
  icons?: string[];
}) {
  return (
    <div className="flex flex-wrap gap-3 w-full justify-center">
      {options.map((opt, i) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            onClick={() => onToggle(opt)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold tracking-wide transition-colors focus:outline-none ${
              active
                ? "border-[#D95D39] bg-[#D95D39]/10 text-[#D95D39]"
                : "border-[#2D3139] text-[#e2e2e9] hover:border-[#D95D39]"
            }`}
          >
            {icons?.[i] && (
              <span className="material-symbols-outlined text-base leading-none">{icons[i]}</span>
            )}
            {opt}
          </button>
        );
      })}
    </div>
  );
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const LEISTUNGEN = [
  "Fotografie",
  "Videografie",
  "Content Creation",
  "Web Grafik",
  "Print Grafik",
  "Webprogrammierung",
  "Social Media",
  "Copywriting",
];
const LEISTUNGEN_ICONS = [
  "photo_camera",
  "videocam",
  "draw",
  "web",
  "print",
  "code",
  "share",
  "edit_note",
];

const BRANCHEN = [
  "Beauty & Lifestyle",
  "Tech & Software",
  "Food & Gastro",
  "Mode & Fashion",
  "Immobilien",
  "Finance",
  "Gesundheit",
  "Sport",
];
const BRANCHEN_ICONS = [
  "spa",
  "computer",
  "restaurant",
  "style",
  "apartment",
  "payments",
  "health_and_safety",
  "fitness_center",
];

// ─── Step 0: Rollenauswahl ─────────────────────────────────────────────────────

function StepRolleAuswahl({
  selected,
  onSelect,
  onNext,
}: {
  selected: Rolle | null;
  onSelect: (r: Rolle) => void;
  onNext: () => void;
}) {
  const cards: { value: Rolle; icon: string; title: string; desc: string }[] = [
    {
      value: "unternehmen",
      icon: "business",
      title: "Unternehmen",
      desc: "Ich suche Marketing-Freelancer für meine Projekte.",
    },
    {
      value: "freelancer",
      icon: "person",
      title: "Freelancer",
      desc: "Ich biete Marketing-Leistungen an.",
    },
  ];
  return (
    <div className="w-full max-w-4xl flex flex-col items-center">
      <h1 className="font-heading text-5xl md:text-6xl text-[#e2e2e9] mb-4 text-center tracking-wide">
        Willkommen. Wer bist du?
      </h1>
      <p className="text-[#dfc0b7] text-lg mb-12 text-center">
        Wähle deine Rolle — du kannst sie später nicht mehr ändern.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-12">
        {cards.map((c) => (
          <button
            key={c.value}
            onClick={() => onSelect(c.value)}
            className={`bg-[#1A1D24] border-2 rounded-xl p-8 text-left flex flex-col gap-6 transition-all duration-300 focus:outline-none ${
              selected === c.value ? "border-[#D95D39]" : "border-[#2D3139] hover:border-[#D95D39]"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full bg-[#0D0F14] border flex items-center justify-center transition-colors ${
                selected === c.value ? "border-[#D95D39]" : "border-[#2D3139]"
              }`}
            >
              <span className="material-symbols-outlined text-[#e2e2e9]">{c.icon}</span>
            </div>
            <div>
              <h2 className="font-semibold text-[#e2e2e9] text-xl mb-2">{c.title}</h2>
              <p className="text-[#dfc0b7] text-base">{c.desc}</p>
            </div>
          </button>
        ))}
      </div>
      <button
        onClick={onNext}
        disabled={!selected}
        className={`py-4 px-16 rounded-full font-bold text-sm tracking-wider uppercase transition-colors ${
          selected
            ? "bg-[#D95D39] text-white hover:bg-[#c44e2e]"
            : "bg-[#2D3139] text-[#7A7D85] cursor-not-allowed"
        }`}
      >
        Weiter
      </button>
    </div>
  );
}

// ─── Step 1: Profil-Setup ──────────────────────────────────────────────────────

function StepProfilSetup({
  rolle,
  initial,
  onNext,
  onBack,
}: {
  rolle: Rolle;
  initial: { anzeigename: string; firmenname: string };
  onNext: (data: { anzeigename: string; firmenname: string }) => void;
  onBack: () => void;
}) {
  const [anzeigename, setAnzeigename] = useState(initial.anzeigename);
  const [firmenname, setFirmenname] = useState(initial.firmenname);
  return (
    <div className="w-full max-w-[480px] flex flex-col items-center">
      <h1 className="font-heading text-5xl text-[#e2e2e9] mb-10 text-center tracking-wide">
        Erzähl uns von dir
      </h1>
      <div className="bg-[#1A1D24] border border-[#2D3139] rounded-xl p-8 w-full">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold tracking-widest uppercase text-[#dfc0b7]">
              Anzeigename
            </label>
            <input
              type="text"
              value={anzeigename}
              onChange={(e) => setAnzeigename(e.target.value)}
              placeholder="Dein Name auf der Plattform"
              maxLength={80}
              className="w-full bg-[#0D0F14] border border-[#2D3139] rounded-xl px-4 py-3 text-[#e2e2e9] placeholder-[#58423c] focus:border-[#D95D39] focus:outline-none transition-colors"
            />
          </div>
          {rolle === "unternehmen" && (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-widest uppercase text-[#dfc0b7]">
                Firmenname
              </label>
              <input
                type="text"
                value={firmenname}
                onChange={(e) => setFirmenname(e.target.value)}
                placeholder="Name deines Unternehmens"
                maxLength={120}
                className="w-full bg-[#0D0F14] border border-[#2D3139] rounded-xl px-4 py-3 text-[#e2e2e9] placeholder-[#58423c] focus:border-[#D95D39] focus:outline-none transition-colors"
              />
            </div>
          )}
          <NavButtons
            onNext={() => onNext({ anzeigename, firmenname })}
            onBack={onBack}
            nextDisabled={!anzeigename.trim()}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Step 2 (Unternehmen): Branche ─────────────────────────────────────────────

const UNTERNEHMEN_BRANCHEN = [...BRANCHEN, "Bildung", "Andere"];
const UNTERNEHMEN_BRANCHEN_ICONS = [...BRANCHEN_ICONS, "school", "category"];

function StepUnternehmenBranche({
  initial,
  onNext,
  onBack,
}: {
  initial: string | null;
  onNext: (branche: string) => void;
  onBack: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(initial);
  return (
    <div className="w-full max-w-2xl flex flex-col items-center">
      <h1 className="font-heading text-5xl text-[#e2e2e9] mb-10 text-center tracking-wide">
        In welcher Branche seid ihr tätig?
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
        {UNTERNEHMEN_BRANCHEN.map((opt, i) => (
          <button
            key={opt}
            onClick={() => setSelected(opt)}
            className={`flex items-center gap-3 bg-[#1A1D24] border-2 rounded-xl px-4 py-4 text-left transition-all duration-200 focus:outline-none ${
              selected === opt ? "border-[#D95D39]" : "border-[#2D3139] hover:border-[#D95D39]"
            }`}
          >
            <span className="material-symbols-outlined text-[#dfc0b7] text-xl leading-none">
              {UNTERNEHMEN_BRANCHEN_ICONS[i]}
            </span>
            <span className="text-sm font-semibold text-[#e2e2e9]">{opt}</span>
          </button>
        ))}
      </div>
      <NavButtons
        onNext={() => selected && onNext(selected)}
        onBack={onBack}
        nextDisabled={!selected}
      />
    </div>
  );
}

// ─── Step 3 (Unternehmen): Grösse ──────────────────────────────────────────────

const GROESSEN = [
  { label: "1–10 Mitarbeitende", description: "Kleines Team oder Startup" },
  { label: "11–50 Mitarbeitende", description: "Wachsendes Unternehmen" },
  { label: "51–200 Mitarbeitende", description: "Mittelständisches Unternehmen" },
  { label: "200+ Mitarbeitende", description: "Grosses Unternehmen" },
];

function StepUnternehmenGroesse({
  initial,
  onNext,
  onBack,
}: {
  initial: string | null;
  onNext: (groesse: string) => void;
  onBack: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(initial);
  return (
    <div className="w-full max-w-lg flex flex-col items-center">
      <h1 className="font-heading text-5xl text-[#e2e2e9] mb-10 text-center tracking-wide">
        Wie gross ist euer Unternehmen?
      </h1>
      <div className="flex flex-col gap-3 w-full">
        {GROESSEN.map((opt) => (
          <RadioCard
            key={opt.label}
            label={opt.label}
            description={opt.description}
            selected={selected === opt.label}
            onSelect={() => setSelected(opt.label)}
          />
        ))}
      </div>
      <NavButtons
        onNext={() => selected && onNext(selected)}
        onBack={onBack}
        nextDisabled={!selected}
      />
    </div>
  );
}

// ─── Step 4 (Unternehmen): Gesuchte Leistungen ─────────────────────────────────

function StepUnternehmenLeistungen({
  initial,
  onNext,
  onBack,
}: {
  initial: string[];
  onNext: (leistungen: string[]) => void;
  onBack: () => void;
}) {
  const [selected, setSelected] = useState<string[]>(initial);
  const toggle = (v: string) =>
    setSelected((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
  return (
    <div className="w-full max-w-2xl flex flex-col items-center">
      <h1 className="font-heading text-5xl text-[#e2e2e9] mb-3 text-center tracking-wide">
        Was sucht ihr?
      </h1>
      <p className="text-[#dfc0b7] text-base mb-10 text-center">
        Wähle alle Bereiche aus, in denen du aktuell oder zukünftig Unterstützung benötigst.
      </p>
      <ChipGrid
        options={LEISTUNGEN}
        selected={selected}
        onToggle={toggle}
        icons={LEISTUNGEN_ICONS}
      />
      <NavButtons
        onNext={() => onNext(selected)}
        onBack={onBack}
        nextDisabled={selected.length === 0}
      />
    </div>
  );
}

// ─── Step 5 (Unternehmen): Dringlichkeit ───────────────────────────────────────

const DRINGLICHKEIT = [
  { label: "Sofort", description: "Wir brauchen jemanden diese Woche." },
  { label: "Bald", description: "Innerhalb eines Monats." },
  { label: "Langfristig planen", description: "Kein fixer Startzeitpunkt." },
  { label: "Wir evaluieren noch Optionen", description: "Noch keine konkrete Anfrage." },
];

function StepUnternehmenDringlichkeit({
  initial,
  onNext,
  onBack,
}: {
  initial: string | null;
  onNext: (dringlichkeit: string) => void;
  onBack: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(initial);
  return (
    <div className="w-full max-w-lg flex flex-col items-center">
      <h1 className="font-heading text-5xl text-[#e2e2e9] mb-3 text-center tracking-wide">
        Wie dringend ist euer erstes Projekt?
      </h1>
      <p className="text-[#dfc0b7] text-base mb-10 text-center">
        Dies hilft uns, die Verfügbarkeit passender Freelancer optimal abzustimmen.
      </p>
      <div className="flex flex-col gap-3 w-full">
        {DRINGLICHKEIT.map((opt) => (
          <RadioCard
            key={opt.label}
            label={opt.label}
            description={opt.description}
            selected={selected === opt.label}
            onSelect={() => setSelected(opt.label)}
          />
        ))}
      </div>
      <NavButtons
        onNext={() => selected && onNext(selected)}
        onBack={onBack}
        nextDisabled={!selected}
      />
    </div>
  );
}

// ─── Step 2 (Freelancer): Spezialisierung ──────────────────────────────────────

function StepFreelancerSpezialisierung({
  initial,
  onNext,
  onBack,
}: {
  initial: string[];
  onNext: (specs: string[]) => void;
  onBack: () => void;
}) {
  const [selected, setSelected] = useState<string[]>(initial);
  const toggle = (v: string) =>
    setSelected((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
  return (
    <div className="w-full max-w-2xl flex flex-col items-center">
      <h1 className="font-heading text-5xl text-[#e2e2e9] mb-3 text-center tracking-wide">
        Was bietest du an?
      </h1>
      <p className="text-[#dfc0b7] text-base mb-10 text-center">
        Wähle deine Kernkompetenzen. Mindestens eine Auswahl erforderlich.
      </p>
      <ChipGrid
        options={LEISTUNGEN}
        selected={selected}
        onToggle={toggle}
        icons={LEISTUNGEN_ICONS}
      />
      <NavButtons
        onNext={() => onNext(selected)}
        onBack={onBack}
        nextDisabled={selected.length === 0}
      />
    </div>
  );
}

// ─── Step 3 (Freelancer): Branchen-Erfahrung ───────────────────────────────────

function StepFreelancerBranchen({
  initial,
  onNext,
  onBack,
}: {
  initial: string[];
  onNext: (branchen: string[]) => void;
  onBack: () => void;
}) {
  const [selected, setSelected] = useState<string[]>(initial);
  const toggle = (v: string) =>
    setSelected((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
  return (
    <div className="w-full max-w-2xl flex flex-col items-center">
      <h1 className="font-heading text-5xl text-[#e2e2e9] mb-3 text-center tracking-wide">
        In welchen Branchen kennst du dich aus?
      </h1>
      <p className="text-[#dfc0b7] text-base mb-10 text-center">Mehrere möglich.</p>
      <ChipGrid options={BRANCHEN} selected={selected} onToggle={toggle} icons={BRANCHEN_ICONS} />
      <NavButtons
        onNext={() => onNext(selected)}
        onBack={onBack}
        nextDisabled={selected.length === 0}
      />
    </div>
  );
}

// ─── Step 4 (Freelancer): Bio & Erfahrung ──────────────────────────────────────

function StepFreelancerBio({
  initial,
  onNext,
  onBack,
}: {
  initial: { erfahrung_jahre: string; bio: string };
  onNext: (data: { erfahrung_jahre: string; bio: string }) => void;
  onBack: () => void;
}) {
  const [erfahrung, setErfahrung] = useState(initial.erfahrung_jahre);
  const [bio, setBio] = useState(initial.bio);
  const isValid = erfahrung.length > 0 && bio.trim().length > 10;
  return (
    <div className="w-full max-w-[480px] flex flex-col items-center">
      <h1 className="font-heading text-5xl text-[#e2e2e9] mb-10 text-center tracking-wide">
        Über dich
      </h1>
      <div className="bg-[#1A1D24] border border-[#2D3139] rounded-xl p-8 w-full">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold tracking-widest uppercase text-[#dfc0b7]">
              Wie viele Jahre Erfahrung?
            </label>
            <div className="relative">
              <select
                value={erfahrung}
                onChange={(e) => setErfahrung(e.target.value)}
                className="w-full bg-[#0D0F14] border border-[#2D3139] rounded-xl px-4 py-3 text-[#e2e2e9] appearance-none focus:border-[#D95D39] focus:outline-none transition-colors cursor-pointer"
              >
                <option value="" disabled>
                  Erfahrung auswählen...
                </option>
                <option value="lt2">Weniger als 2 Jahre</option>
                <option value="2-5">2–5 Jahre</option>
                <option value="5-10">5–10 Jahre</option>
                <option value="10plus">10+ Jahre</option>
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#dfc0b7] pointer-events-none text-base leading-none">
                expand_more
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold tracking-widest uppercase text-[#dfc0b7]">
              Kurze Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 300))}
              placeholder="Beschreibe kurz deine Erfahrung und was dich ausmacht..."
              rows={5}
              className="w-full bg-[#0D0F14] border border-[#2D3139] rounded-xl px-4 py-3 text-[#e2e2e9] placeholder-[#58423c] focus:border-[#D95D39] focus:outline-none transition-colors resize-none"
            />
            <span className="text-xs text-[#dfc0b7] text-right">{bio.length}/300</span>
          </div>
          <NavButtons
            onNext={() => onNext({ erfahrung_jahre: erfahrung, bio })}
            onBack={onBack}
            nextDisabled={!isValid}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Step 5 (Freelancer): Verfügbarkeit ────────────────────────────────────────

const VERFUEGBARKEIT = [
  {
    value: "sofort",
    label: "Sofort verfügbar",
    description: "Ich bin bereit, direkt neue Projekte anzunehmen.",
  },
  {
    value: "datum",
    label: "Ab einem bestimmten Datum",
    description: "Ich werde ab einem bestimmten Datum verfügbar.",
  },
  {
    value: "anfrage",
    label: "Auf Anfrage",
    description: "Aktuell ausgelastet, aber offen für interessante Angebote.",
  },
];

function StepFreelancerVerfuegbarkeit({
  initial,
  onNext,
  onBack,
}: {
  initial: { verfuegbarkeit: string | null; verfuegbar_ab: string };
  onNext: (data: { verfuegbarkeit: string; verfuegbar_ab: string }) => void;
  onBack: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(initial.verfuegbarkeit);
  const [datum, setDatum] = useState(initial.verfuegbar_ab);
  const isValid = selected !== null && (selected !== "datum" || datum.trim().length > 0);
  return (
    <div className="w-full max-w-lg flex flex-col items-center">
      <h1 className="font-heading text-5xl text-[#e2e2e9] mb-10 text-center tracking-wide">
        Wann bist du verfügbar?
      </h1>
      <div className="flex flex-col gap-3 w-full">
        {VERFUEGBARKEIT.map((opt) => (
          <div key={opt.value}>
            <RadioCard
              label={opt.label}
              description={opt.description}
              selected={selected === opt.value}
              onSelect={() => setSelected(opt.value)}
            />
            {selected === "datum" && opt.value === "datum" && (
              <input
                type="date"
                value={datum}
                onChange={(e) => setDatum(e.target.value)}
                className="mt-2 w-full bg-[#0D0F14] border border-[#2D3139] rounded-xl px-4 py-3 text-[#e2e2e9] focus:border-[#D95D39] focus:outline-none transition-colors"
              />
            )}
          </div>
        ))}
      </div>
      <NavButtons
        onNext={() => selected && onNext({ verfuegbarkeit: selected, verfuegbar_ab: datum })}
        onBack={onBack}
        nextDisabled={!isValid}
      />
    </div>
  );
}

// ─── Step 6 (Freelancer): Portfolio Upload ─────────────────────────────────────

function StepFreelancerPortfolio({
  onNext,
  onBack,
  onSkip,
}: {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    setFiles((prev) => [...prev, ...Array.from(list)].slice(0, 3));
  };

  const removeFile = (i: number) => setFiles((prev) => prev.filter((_, idx) => idx !== i));

  return (
    <div className="w-full max-w-lg flex flex-col items-center">
      <h1 className="font-heading text-5xl text-[#e2e2e9] mb-3 text-center tracking-wide">
        Zeig deine Arbeit
      </h1>
      <p className="text-[#dfc0b7] text-base mb-10 text-center">
        Optional — du kannst das später ergänzen.
      </p>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          addFiles(e.dataTransfer.files);
        }}
        className={`w-full border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors ${
          dragOver ? "border-[#D95D39] bg-[#D95D39]/5" : "border-[#2D3139] hover:border-[#D95D39]"
        }`}
      >
        <span className="material-symbols-outlined text-[#dfc0b7] text-5xl leading-none">
          cloud_upload
        </span>
        <p className="text-[#dfc0b7] text-sm text-center">
          Dateien hierher ziehen oder <span className="text-[#D95D39] underline">auswählen</span>
        </p>
        <p className="text-xs text-[#58423c]">Max. 3 Dateien · 10 MB · PDF, Bilder, Videos</p>
        <input
          type="file"
          multiple
          accept="image/*,video/*,application/pdf"
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </label>
      {files.length > 0 && (
        <div className="w-full mt-4 flex flex-col gap-2">
          {files.map((f, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-[#1A1D24] border border-[#2D3139] rounded-xl px-4 py-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="material-symbols-outlined text-[#dfc0b7] text-base flex-shrink-0 leading-none">
                  description
                </span>
                <span className="text-sm text-[#e2e2e9] truncate">{f.name}</span>
              </div>
              <button
                onClick={() => removeFile(i)}
                className="text-[#dfc0b7] hover:text-[#D95D39] transition-colors flex-shrink-0 ml-2"
              >
                <span className="material-symbols-outlined text-base leading-none">close</span>
              </button>
            </div>
          ))}
        </div>
      )}
      <NavButtons
        onNext={onNext}
        onBack={onBack}
        nextDisabled={files.length === 0}
        skipLabel="Überspringen"
        onSkip={onSkip}
      />
    </div>
  );
}

// ─── Welcome ───────────────────────────────────────────────────────────────────

function StepWillkommen({ rolle }: { rolle: Rolle }) {
  return (
    <div className="w-full max-w-lg flex flex-col items-center text-center">
      <h1 className="font-heading text-6xl md:text-8xl text-[#e2e2e9] mb-6 tracking-wide">
        Du bist bereit.
      </h1>
      <p className="text-[#dfc0b7] text-lg mb-12">
        {rolle === "freelancer"
          ? "Dein Profil ist eingerichtet. Starte direkt und finde deinen ersten Auftrag."
          : "Dein Konto ist eingerichtet. Starte direkt und finde deinen ersten Freelancer."}
      </p>
      <div className="bg-[#1A1D24] border border-[#2D3139] rounded-xl p-6 w-full mb-12 hover:border-[#D95D39] transition-colors group text-left">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-16 h-16 rounded-full bg-[#2D3139] border-2 border-[#2D3139] group-hover:border-[#D95D39] transition-colors flex-shrink-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-[#dfc0b7] text-3xl leading-none">
              person
            </span>
          </div>
          <div>
            <h3 className="font-heading text-2xl text-[#e2e2e9] mb-1">Marc Müller</h3>
            <p className="text-sm font-semibold text-[#D95D39] mb-1">
              Senior Performance Marketing
            </p>
            <div className="flex items-center gap-1 text-sm text-[#dfc0b7]">
              <span className="material-symbols-outlined text-sm leading-none">work</span>
              <span>8 Jahre Erfahrung</span>
            </div>
          </div>
        </div>
        <div className="border-t border-[#2D3139] pt-4 flex justify-between text-sm text-[#dfc0b7]">
          <span>Top bewertet</span>
          <span className="flex items-center gap-1 text-[#e2e2e9]">
            <span className="material-symbols-outlined text-sm text-[#D95D39] leading-none">
              star
            </span>
            5.0
          </span>
        </div>
      </div>
      <a
        href={rolle === "freelancer" ? "/dashboard/freelancer" : "/dashboard/unternehmen"}
        className="flex items-center justify-center gap-2 bg-[#D95D39] text-white font-bold text-sm tracking-wider uppercase px-12 py-4 rounded-full hover:bg-[#c44e2e] transition-colors w-full max-w-sm shadow-lg"
      >
        Zur Plattform
        <span className="material-symbols-outlined text-base leading-none">arrow_forward</span>
      </a>
    </div>
  );
}

// ─── Main orchestrator ─────────────────────────────────────────────────────────

export function OnboardingForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(defaultData);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const back = () => setStep((s) => s - 1);

  // Advance to next step, optionally merging data updates.
  // On the last step before Welcome, triggers the server action instead.
  const advance = (updates?: Partial<OnboardingData>) => {
    const merged = updates ? { ...data, ...updates } : data;
    setData(merged);

    const nextStep = step + 1;
    const willBeWelcome =
      (merged.rolle === "unternehmen" && nextStep === 6) ||
      (merged.rolle === "freelancer" && nextStep === 7);

    if (willBeWelcome) {
      setSubmitError(null);
      startTransition(async () => {
        const result = await onboarding({
          rolle: merged.rolle as "unternehmen" | "freelancer",
          anzeigename: merged.anzeigename,
          firmenname: merged.firmenname || undefined,
          branche: merged.branche ?? undefined,
          unternehmensgroesse: merged.unternehmensgroesse ?? undefined,
          gesuchte_leistungen: merged.gesuchte_leistungen,
          dringlichkeit: merged.dringlichkeit ?? undefined,
          spezialisierungen: merged.spezialisierungen,
          branchen_erfahrung: merged.branchen_erfahrung,
          erfahrung_jahre: merged.erfahrung_jahre || undefined,
          bio: merged.bio || undefined,
          verfuegbarkeit: merged.verfuegbarkeit ?? undefined,
          verfuegbar_ab: merged.verfuegbar_ab || undefined,
        });
        if (result.error) {
          setSubmitError(result.error);
        } else {
          setStep(nextStep);
        }
      });
    } else {
      setStep(nextStep);
    }
  };

  const totalSteps = data.rolle === "freelancer" ? 7 : 6;
  const isWelcome =
    (data.rolle === "unternehmen" && step === 6) || (data.rolle === "freelancer" && step === 7);

  const renderStep = () => {
    if (isWelcome) return <StepWillkommen rolle={data.rolle!} />;
    switch (step) {
      case 0:
        return (
          <StepRolleAuswahl
            selected={data.rolle}
            onSelect={(r) => setData((prev) => ({ ...prev, rolle: r }))}
            onNext={() => advance()}
          />
        );
      case 1:
        return (
          <StepProfilSetup
            rolle={data.rolle!}
            initial={{ anzeigename: data.anzeigename, firmenname: data.firmenname }}
            onNext={(d) => advance(d)}
            onBack={back}
          />
        );
      case 2:
        return data.rolle === "unternehmen" ? (
          <StepUnternehmenBranche
            initial={data.branche}
            onNext={(branche) => advance({ branche })}
            onBack={back}
          />
        ) : (
          <StepFreelancerSpezialisierung
            initial={data.spezialisierungen}
            onNext={(spezialisierungen) => advance({ spezialisierungen })}
            onBack={back}
          />
        );
      case 3:
        return data.rolle === "unternehmen" ? (
          <StepUnternehmenGroesse
            initial={data.unternehmensgroesse}
            onNext={(unternehmensgroesse) => advance({ unternehmensgroesse })}
            onBack={back}
          />
        ) : (
          <StepFreelancerBranchen
            initial={data.branchen_erfahrung}
            onNext={(branchen_erfahrung) => advance({ branchen_erfahrung })}
            onBack={back}
          />
        );
      case 4:
        return data.rolle === "unternehmen" ? (
          <StepUnternehmenLeistungen
            initial={data.gesuchte_leistungen}
            onNext={(gesuchte_leistungen) => advance({ gesuchte_leistungen })}
            onBack={back}
          />
        ) : (
          <StepFreelancerBio
            initial={{ erfahrung_jahre: data.erfahrung_jahre, bio: data.bio }}
            onNext={(d) => advance(d)}
            onBack={back}
          />
        );
      case 5:
        return data.rolle === "unternehmen" ? (
          <StepUnternehmenDringlichkeit
            initial={data.dringlichkeit}
            onNext={(dringlichkeit) => advance({ dringlichkeit })}
            onBack={back}
          />
        ) : (
          <StepFreelancerVerfuegbarkeit
            initial={{ verfuegbarkeit: data.verfuegbarkeit, verfuegbar_ab: data.verfuegbar_ab }}
            onNext={(d) => advance(d)}
            onBack={back}
          />
        );
      case 6:
        return data.rolle === "freelancer" ? (
          <StepFreelancerPortfolio
            onNext={() => advance()}
            onBack={back}
            onSkip={() => advance()}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0F14] text-[#e2e2e9] relative overflow-x-hidden flex flex-col">
      <GlobalSphere />
      <OnboardingHeader />
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-28 pb-16 z-10 relative">
        {!isWelcome && <StepIndicator current={step + 1} total={totalSteps} />}
        {submitError && (
          <div className="w-full max-w-lg mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400 text-center">
            {submitError}
          </div>
        )}
        {isPending ? (
          <div className="flex flex-col items-center gap-4 text-[#dfc0b7]">
            <div className="w-8 h-8 border-2 border-[#D95D39] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm tracking-wide">Wird gespeichert…</span>
          </div>
        ) : (
          renderStep()
        )}
      </main>
    </div>
  );
}
