"use client";

import { useEffect, useState } from "react";
import { PlatzhalterBild } from "@/components/platzhalter-bild";
import { getFreelancers } from "@/lib/mock/freelancer";
import Link from "next/link";
import { erstelleProjekt } from "./actions";

// ─── Types ─────────────────────────────────────────────────────────────────────

type Modus = "selbst" | "beratung";

type WizardStep = "name" | "modus" | "kontext" | "empfehlung" | "leistungen" | "budget" | "zeitrahmen" | "matching";

type WizardData = {
  name: string;
  modus: Modus | null;
  beschreibung: string;
  leistungen: string[];
  budget: string | null;
  zeitrahmen: string | null;
};

const defaultData: WizardData = {
  name: "",
  modus: null,
  beschreibung: "",
  leistungen: [],
  budget: null,
  zeitrahmen: null,
};

// Visual step number + total for indicator, depends on path
function visualStep(step: WizardStep, modus: Modus | null): { current: number; total: number } {
  const withBeratung: WizardStep[] = ["name", "modus", "kontext", "empfehlung", "budget", "zeitrahmen"];
  const ohnBeratung: WizardStep[] = ["name", "modus", "leistungen", "budget", "zeitrahmen"];
  const sequence = modus === "beratung" ? withBeratung : ohnBeratung;
  const idx = sequence.indexOf(step);
  return { current: idx + 1, total: sequence.length };
}

// ─── Shared atoms ──────────────────────────────────────────────────────────────

function StepIndicator({ step, modus }: { step: WizardStep; modus: Modus | null }) {
  if (step === "matching" || step === "empfehlung") return null;
  const { current, total } = visualStep(step, modus);
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
  onClose,
}: {
  onNext: () => void;
  onBack?: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  onClose?: () => void;
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
      {onClose && (
        <button
          onClick={onClose}
          className="w-full py-3 text-sm font-semibold text-[#dfc0b7] hover:text-[#e2e2e9] transition-colors tracking-wide"
        >
          Abbrechen
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
      className={`w-full flex items-center justify-between gap-4 bg-[#1A1D24] border-2 rounded-xl p-4 text-left transition-all duration-200 focus:outline-none ${
        selected ? "border-[#D95D39]" : "border-[#2D3139] hover:border-[#D95D39]/50"
      }`}
    >
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
    </button>
  );
}

// ─── Steps ────────────────────────────────────────────────────────────────────

function StepName({
  initial,
  onNext,
  onClose,
}: {
  initial: string;
  onNext: (name: string) => void;
  onClose: () => void;
}) {
  const [value, setValue] = useState(initial);
  return (
    <div className="w-full max-w-lg flex flex-col items-center">
      <h1 className="font-heading text-5xl text-[#e2e2e9] mb-4 text-center tracking-wide">
        Wie heisst dein Projekt?
      </h1>
      <p className="text-[#dfc0b7] text-base mb-10 text-center">
        Gib deinem Projekt einen klaren, aussagekräftigen Namen.
      </p>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="z. B. Social-Media-Kampagne Q3"
        className="w-full bg-[#0D0F14] border border-[#2D3139] rounded-xl px-5 py-4 text-[#e2e2e9] placeholder-[#4A4D55] text-base focus:border-[#D95D39] focus:outline-none transition-colors"
        autoFocus
        onKeyDown={(e) => e.key === "Enter" && value.trim() && onNext(value.trim())}
      />
      <NavButtons
        onNext={() => onNext(value.trim())}
        nextDisabled={value.trim().length === 0}
        onClose={onClose}
      />
    </div>
  );
}

function StepModus({
  onSelect,
  onBack,
}: {
  onSelect: (modus: Modus) => void;
  onBack: () => void;
}) {
  const [selected, setSelected] = useState<Modus | null>(null);

  const options: { value: Modus; icon: string; title: string; desc: string }[] = [
    {
      value: "selbst",
      icon: "check_circle",
      title: "Ich weiss, was ich brauche",
      desc: "Ich kenne die Leistungen, die ich suche, und wähle sie selbst aus.",
    },
    {
      value: "beratung",
      icon: "auto_awesome",
      title: "Berate mich",
      desc: "Ich beschreibe mein Projekt und erhalte eine KI-gestützte Empfehlung.",
    },
  ];

  return (
    <div className="w-full max-w-2xl flex flex-col items-center">
      <h1 className="font-heading text-5xl text-[#e2e2e9] mb-4 text-center tracking-wide">
        Wie möchtest du vorgehen?
      </h1>
      <p className="text-[#dfc0b7] text-base mb-12 text-center">
        Wähle den Weg, der am besten zu dir passt.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-8">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setSelected(opt.value)}
            className={`bg-[#1A1D24] border-2 rounded-xl p-8 text-left flex flex-col gap-5 transition-all duration-200 focus:outline-none ${
              selected === opt.value
                ? "border-[#D95D39]"
                : "border-[#2D3139] hover:border-[#D95D39]/50"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full bg-[#0D0F14] border flex items-center justify-center transition-colors ${
                selected === opt.value ? "border-[#D95D39]" : "border-[#2D3139]"
              }`}
            >
              <span
                className={`material-symbols-outlined transition-colors ${
                  selected === opt.value ? "text-[#D95D39]" : "text-[#e2e2e9]"
                }`}
              >
                {opt.icon}
              </span>
            </div>
            <div>
              <h2 className="font-semibold text-[#e2e2e9] text-lg mb-2">{opt.title}</h2>
              <p className="text-[#dfc0b7] text-sm leading-relaxed">{opt.desc}</p>
            </div>
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-3 w-full">
        <button
          onClick={() => selected && onSelect(selected)}
          disabled={!selected}
          className={`w-full py-4 px-6 rounded-full font-bold text-sm tracking-wider uppercase transition-colors ${
            selected
              ? "bg-[#D95D39] text-white hover:bg-[#c44e2e]"
              : "bg-[#2D3139] text-[#7A7D85] cursor-not-allowed"
          }`}
        >
          Weiter
        </button>
        <button
          onClick={onBack}
          className="w-full py-4 px-6 rounded-full font-bold text-sm tracking-wider uppercase border border-[#2D3139] text-[#e2e2e9] hover:border-[#D95D39] transition-colors"
        >
          Zurück
        </button>
      </div>
    </div>
  );
}

function StepKontext({
  initial,
  onNext,
  onBack,
}: {
  initial: string;
  onNext: (beschreibung: string) => void;
  onBack: () => void;
}) {
  const [value, setValue] = useState(initial);
  return (
    <div className="w-full max-w-lg flex flex-col items-center">
      <h1 className="font-heading text-5xl text-[#e2e2e9] mb-4 text-center tracking-wide">
        Beschreibe dein Projekt
      </h1>
      <p className="text-[#dfc0b7] text-base mb-6 text-center">
        Je mehr Kontext du gibst, desto besser kann unsere KI dich beraten.
      </p>

      {/* Warning */}
      <div className="w-full flex gap-3 items-start bg-[#D95D39]/10 border border-[#D95D39]/40 rounded-xl px-5 py-4 mb-8">
        <span className="material-symbols-outlined text-[#D95D39] text-xl leading-none mt-0.5 flex-shrink-0">
          warning
        </span>
        <p className="text-[#e2e2e9] text-sm leading-relaxed">
          <span className="font-semibold">Wichtig:</span> Erkläre deine Bedürfnisse so genau wie
          möglich — Zielgruppe, Ziel, Branche, bisherige Massnahmen. Je mehr Details, desto
          präziser die Empfehlung.
        </p>
      </div>

      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="z. B. Wir sind ein Startup im Bereich nachhaltige Mode. Wir möchten unsere Markenbekanntheit auf Instagram und TikTok steigern, um die Gen-Z-Zielgruppe anzusprechen. Bisher haben wir noch keine professionelle Social-Media-Strategie..."
        rows={7}
        className="w-full bg-[#0D0F14] border border-[#2D3139] rounded-xl px-5 py-4 text-[#e2e2e9] placeholder-[#4A4D55] text-base focus:border-[#D95D39] focus:outline-none transition-colors resize-none"
      />
      <NavButtons
        onNext={() => onNext(value.trim())}
        onBack={onBack}
        nextDisabled={value.trim().length === 0}
        nextLabel="Analyse starten"
      />
    </div>
  );
}

// Derive recommended services from keywords in the project description (static heuristic)
function empfohleneleistungen(beschreibung: string): string[] {
  const t = beschreibung.toLowerCase();
  const hits: string[] = [];
  if (/instagram|tiktok|social|reels|stories/.test(t)) hits.push("Social Media", "Content Creation");
  if (/video|reels|film|youtube/.test(t)) hits.push("Videografie");
  if (/foto|bild|photoshoot/.test(t)) hits.push("Fotografie");
  if (/web|website|landing|shop/.test(t)) hits.push("Webprogrammierung", "Web Grafik");
  if (/brand|marke|logo|identit/.test(t)) hits.push("Branding");
  if (/text|copy|blog|artikel/.test(t)) hits.push("Copywriting");
  if (/seo|sea|google|ads/.test(t)) hits.push("SEO / SEA");
  if (/print|flyer|plakat|broschüre/.test(t)) hits.push("Print Grafik");
  const unique = [...new Set(hits)];
  return unique.length > 0 ? unique : ["Social Media", "Content Creation", "Branding"];
}

const TIPPS = [
  { icon: "description", text: "Erstelle ein klares Briefing mit Zielen, Zielgruppe und Deadlines." },
  { icon: "bar_chart", text: "Definiere messbare KPIs vor Projektstart (Reichweite, Conversions, etc.)." },
  { icon: "handshake", text: "Kläre Nutzungsrechte für alle erstellten Inhalte im Voraus." },
];

function StepEmpfehlung({
  beschreibung,
  onNext,
  onBack,
}: {
  beschreibung: string;
  onNext: (leistungen: string[]) => void;
  onBack: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [recommended, setRecommended] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [tipps, setTipps] = useState<{ icon: string; text: string }[]>([]);
  const freelancer = getFreelancers().slice(0, 3);

  useEffect(() => {
    const icons = ["description", "bar_chart", "handshake"];
    fetch("/api/ki-analyse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ beschreibung }),
    })
      .then((r) => r.json())
      .then((data) => {
        const valid = (data.leistungen as string[] ?? []).filter((l) =>
          ALLE_LEISTUNGEN_LABELS.includes(l)
        );
        const recs = valid.length > 0 ? valid : empfohleneleistungen(beschreibung);
        setRecommended(recs);
        setSelected(recs);
        const rawTipps = Array.isArray(data.tipps) && data.tipps.length > 0 ? data.tipps : null;
        setTipps(
          rawTipps
            ? rawTipps.slice(0, 3).map((text: string, i: number) => ({ icon: icons[i] ?? "lightbulb", text }))
            : TIPPS
        );
      })
      .catch(() => {
        const recs = empfohleneleistungen(beschreibung);
        setRecommended(recs);
        setSelected(recs);
        setTipps(TIPPS);
      })
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = (v: string) =>
    setSelected((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));

  if (loading) {
    return (
      <div className="w-full max-w-2xl flex flex-col items-center justify-center py-20">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D95D39]/10 border border-[#D95D39]/30 mb-8">
          <span className="material-symbols-outlined text-[#D95D39] text-base leading-none animate-spin">autorenew</span>
          <span className="text-xs font-semibold tracking-widest uppercase text-[#D95D39]">KI analysiert...</span>
        </div>
        <h1 className="font-heading text-4xl text-[#e2e2e9] mb-4 text-center tracking-wide">
          Dein Projekt wird analysiert
        </h1>
        <p className="text-[#dfc0b7] text-base text-center">
          Einen Moment – die KI liest deine Beschreibung.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl flex flex-col items-center">
      {/* KI badge */}
      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D95D39]/10 border border-[#D95D39]/30 mb-6">
        <span className="material-symbols-outlined text-[#D95D39] text-base leading-none">auto_awesome</span>
        <span className="text-xs font-semibold tracking-widest uppercase text-[#D95D39]">KI-Analyse</span>
      </div>

      <h1 className="font-heading text-5xl text-[#e2e2e9] mb-4 text-center tracking-wide">
        Unsere Empfehlung
      </h1>
      <p className="text-[#dfc0b7] text-base mb-10 text-center">
        Basierend auf deiner Projektbeschreibung empfehlen wir dir folgende Leistungen und Freelancer.
      </p>

      {/* Empfohlene Leistungen */}
      <div className="w-full mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#dfc0b7] mb-4">
          Empfohlene Leistungen
        </p>
        <div className="flex flex-wrap gap-3">
          {ALLE_LEISTUNGEN_LABELS.map((label) => {
            const isRecommended = recommended.includes(label);
            const isActive = selected.includes(label);
            return (
              <button
                key={label}
                onClick={() => toggle(label)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold tracking-wide transition-colors focus:outline-none ${
                  isActive
                    ? "border-[#D95D39] bg-[#D95D39]/10 text-[#D95D39]"
                    : "border-[#2D3139] text-[#5A5D65] hover:border-[#D95D39]/30"
                }`}
              >
                {isRecommended && isActive && (
                  <span className="material-symbols-outlined text-sm leading-none">auto_awesome</span>
                )}
                {label}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-[#4A4D55] mt-3">
          KI-Empfehlungen sind markiert. Du kannst die Auswahl anpassen.
        </p>
      </div>

      {/* Empfohlene Freelancer */}
      <div className="w-full mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#dfc0b7] mb-4">
          Passende Freelancer
        </p>
        <div className="grid grid-cols-3 gap-4">
          {freelancer.map((f) => (
            <div
              key={f.id}
              className="flex flex-col items-center bg-[#1A1D24] border border-[#2D3139] rounded-xl p-4 text-center"
            >
              <div className="relative mb-3 w-full overflow-hidden rounded-lg aspect-square">
                <PlatzhalterBild
                  alt={`Portrait von ${f.name}`}
                  radius="card"
                  className="absolute inset-0 h-full w-full"
                />
              </div>
              <p className="font-bold text-[#e2e2e9] text-sm mb-0.5 leading-tight">{f.name}</p>
              <p className="text-[#dfc0b7] text-xs mb-2 leading-tight">{f.rolle}</p>
              <div className="flex text-[#D95D39] text-sm" aria-hidden="true">★★★★★</div>
              <div className="mt-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#D95D39]/10 text-[#D95D39] border border-[#D95D39]/30">
                Empfohlen
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weitere Tipps */}
      <div className="w-full mb-2">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#dfc0b7] mb-4">
          Weitere Empfehlungen
        </p>
        <div className="flex flex-col gap-3">
          {tipps.map((t, i) => (
            <div key={i} className="flex items-start gap-3 bg-[#1A1D24] border border-[#2D3139] rounded-xl px-4 py-3">
              <span className="material-symbols-outlined text-[#D95D39] text-base leading-none mt-0.5 flex-shrink-0">{t.icon}</span>
              <p className="text-[#dfc0b7] text-sm leading-relaxed">{t.text}</p>
            </div>
          ))}
        </div>
      </div>

      <NavButtons
        onNext={() => onNext(selected)}
        onBack={onBack}
        nextDisabled={selected.length === 0}
        nextLabel="Weiter"
      />
    </div>
  );
}

const ALLE_LEISTUNGEN_LABELS = [
  "Videografie", "Webprogrammierung", "Fotografie", "Content Creation",
  "Print Grafik", "Web Grafik", "Social Media", "SEO / SEA", "Branding", "Copywriting",
];

const LEISTUNGEN = [
  { label: "Videografie", icon: "videocam" },
  { label: "Webprogrammierung", icon: "code" },
  { label: "Fotografie", icon: "photo_camera" },
  { label: "Content Creation", icon: "edit_note" },
  { label: "Print Grafik", icon: "print" },
  { label: "Web Grafik", icon: "palette" },
  { label: "Social Media", icon: "thumb_up" },
  { label: "SEO / SEA", icon: "search" },
  { label: "Branding", icon: "star" },
  { label: "Copywriting", icon: "description" },
];

function StepLeistungen({
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
      <h1 className="font-heading text-5xl text-[#e2e2e9] mb-4 text-center tracking-wide">
        Welche Leistungen benötigst du?
      </h1>
      <p className="text-[#dfc0b7] text-base mb-10 text-center">
        Wähle alle Bereiche, in denen du Unterstützung brauchst.
      </p>
      <div className="flex flex-wrap gap-3 justify-center w-full mb-2">
        {LEISTUNGEN.map((opt) => {
          const active = selected.includes(opt.label);
          return (
            <button
              key={opt.label}
              onClick={() => toggle(opt.label)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold tracking-wide transition-colors focus:outline-none ${
                active
                  ? "border-[#D95D39] bg-[#D95D39]/10 text-[#D95D39]"
                  : "border-[#2D3139] text-[#e2e2e9] hover:border-[#D95D39]/50"
              }`}
            >
              <span className="material-symbols-outlined text-base leading-none">{opt.icon}</span>
              {opt.label}
            </button>
          );
        })}
      </div>
      <NavButtons
        onNext={() => onNext(selected)}
        onBack={onBack}
        nextDisabled={selected.length === 0}
      />
    </div>
  );
}

const BUDGETS = [
  { label: "Unter 1'000 CHF", description: "Kleinauftrag oder Einstiegsprojekt" },
  { label: "1'000 – 5'000 CHF", description: "Mittleres Projekt mit klarem Umfang" },
  { label: "5'000 – 20'000 CHF", description: "Grösseres Projekt oder laufende Zusammenarbeit" },
  { label: "20'000+ CHF", description: "Enterprise-Projekt oder Langzeitmandat" },
];

function StepBudget({
  initial,
  onNext,
  onBack,
}: {
  initial: string | null;
  onNext: (budget: string) => void;
  onBack: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(initial);
  return (
    <div className="w-full max-w-lg flex flex-col items-center">
      <h1 className="font-heading text-5xl text-[#e2e2e9] mb-4 text-center tracking-wide">
        Was ist euer Budget?
      </h1>
      <p className="text-[#dfc0b7] text-base mb-10 text-center">
        Das hilft uns, passende Freelancer zu finden.
      </p>
      <div className="flex flex-col gap-3 w-full">
        {BUDGETS.map((opt) => (
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

const ZEITRAHMEN = [
  { label: "Sofort", description: "Wir brauchen jemanden diese Woche." },
  { label: "Innerhalb eines Monats", description: "Projekt startet bald." },
  { label: "In 2–3 Monaten", description: "Wir haben noch etwas Zeit." },
  { label: "Noch flexibel", description: "Kein fixer Startzeitpunkt." },
];

function StepZeitrahmen({
  initial,
  onNext,
  onBack,
}: {
  initial: string | null;
  onNext: (zeitrahmen: string) => void;
  onBack: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(initial);
  return (
    <div className="w-full max-w-lg flex flex-col items-center">
      <h1 className="font-heading text-5xl text-[#e2e2e9] mb-4 text-center tracking-wide">
        Wann braucht ihr jemanden?
      </h1>
      <p className="text-[#dfc0b7] text-base mb-10 text-center">
        Wähle den passenden Zeitrahmen für euer Projekt.
      </p>
      <div className="flex flex-col gap-3 w-full">
        {ZEITRAHMEN.map((opt) => (
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
        nextLabel="Freelancer finden"
      />
    </div>
  );
}

function StepMatching({ data, onClose }: { data: WizardData; onClose: () => void }) {
  const freelancer = getFreelancers().slice(0, 3);
  return (
    <div className="w-full max-w-2xl flex flex-col items-center">
      <div className="w-16 h-16 rounded-full bg-[#D95D39]/15 border border-[#D95D39]/30 flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-[#D95D39] text-3xl">check_circle</span>
      </div>
      <h1 className="font-heading text-5xl text-[#e2e2e9] mb-4 text-center tracking-wide">
        Wir haben passende Freelancer!
      </h1>
      <p className="text-[#dfc0b7] text-base mb-3 text-center">
        Basierend auf deinen Angaben haben wir{" "}
        <span className="text-[#D95D39] font-semibold">{freelancer.length} Freelancer</span> für{" "}
        <span className="text-[#e2e2e9] font-semibold">«{data.name}»</span> gefunden.
      </p>
      {data.leistungen.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {data.leistungen.map((l) => (
            <span
              key={l}
              className="px-3 py-1 rounded-full text-xs font-semibold border border-[#D95D39]/40 text-[#D95D39] bg-[#D95D39]/10"
            >
              {l}
            </span>
          ))}
        </div>
      )}
      <div className="grid grid-cols-3 gap-4 w-full mb-8">
        {freelancer.map((f) => (
          <div
            key={f.id}
            className="flex flex-col items-center bg-[#1A1D24] border border-[#2D3139] rounded-xl p-4 text-center"
          >
            <div className="relative mb-3 w-full overflow-hidden rounded-lg aspect-square">
              <PlatzhalterBild
                alt={`Portrait von ${f.name}`}
                radius="card"
                className="absolute inset-0 h-full w-full"
              />
            </div>
            <p className="font-bold text-[#e2e2e9] text-sm mb-0.5 leading-tight">{f.name}</p>
            <p className="text-[#dfc0b7] text-xs mb-2 leading-tight">{f.rolle}</p>
            <div className="flex text-[#D95D39] text-sm" aria-hidden="true">
              ★★★★★
            </div>
            <div className="mt-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#D95D39]/10 text-[#D95D39] border border-[#D95D39]/30">
              Match
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3 w-full">
        <Link
          href="/freelancer"
          className="w-full py-4 px-6 rounded-full font-bold text-sm tracking-wider uppercase transition-colors bg-[#D95D39] text-white hover:bg-[#c44e2e] text-center"
          onClick={onClose}
        >
          Alle Freelancer ansehen
          <span className="material-symbols-outlined text-base leading-none ml-2 align-middle">
            arrow_forward
          </span>
        </Link>
        <button
          onClick={onClose}
          className="w-full py-4 px-6 rounded-full font-bold text-sm tracking-wider uppercase border border-[#2D3139] text-[#e2e2e9] hover:border-[#D95D39] transition-colors"
        >
          Schliessen
        </button>
      </div>
    </div>
  );
}

function StepAbschluss({ data, onClose }: { data: WizardData; onClose: () => void }) {
  const summary = [
    { icon: "folder", label: "Projekt", value: data.name },
    { icon: "payments", label: "Budget", value: data.budget ?? "–" },
    { icon: "schedule", label: "Zeitrahmen", value: data.zeitrahmen ?? "–" },
  ];

  return (
    <div className="w-full max-w-lg flex flex-col items-center">
      <div className="w-16 h-16 rounded-full bg-[#D95D39]/15 border border-[#D95D39]/30 flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-[#D95D39] text-3xl">rocket_launch</span>
      </div>
      <h1 className="font-heading text-5xl text-[#e2e2e9] mb-4 text-center tracking-wide">
        Dein Projekt ist bereit!
      </h1>
      <p className="text-[#dfc0b7] text-base mb-10 text-center">
        Die KI-Analyse ist abgeschlossen. Hier ist eine Zusammenfassung deines Projekts.
      </p>

      {/* Summary */}
      <div className="w-full flex flex-col gap-3 mb-8">
        {summary.map((s) => (
          <div key={s.label} className="flex items-center gap-4 bg-[#1A1D24] border border-[#2D3139] rounded-xl px-5 py-3">
            <span className="material-symbols-outlined text-[#D95D39] text-base leading-none flex-shrink-0">{s.icon}</span>
            <span className="text-[#dfc0b7] text-sm w-24 flex-shrink-0">{s.label}</span>
            <span className="text-[#e2e2e9] text-sm font-semibold">{s.value}</span>
          </div>
        ))}
        {data.leistungen.length > 0 && (
          <div className="flex items-start gap-4 bg-[#1A1D24] border border-[#2D3139] rounded-xl px-5 py-3">
            <span className="material-symbols-outlined text-[#D95D39] text-base leading-none flex-shrink-0 mt-0.5">auto_awesome</span>
            <span className="text-[#dfc0b7] text-sm w-24 flex-shrink-0">Leistungen</span>
            <div className="flex flex-wrap gap-2">
              {data.leistungen.map((l) => (
                <span key={l} className="px-2 py-0.5 rounded-full text-xs font-semibold border border-[#D95D39]/40 text-[#D95D39] bg-[#D95D39]/10">
                  {l}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 w-full">
        <Link
          href="/freelancer"
          className="w-full py-4 px-6 rounded-full font-bold text-sm tracking-wider uppercase transition-colors bg-[#D95D39] text-white hover:bg-[#c44e2e] text-center"
          onClick={onClose}
        >
          Empfohlene Freelancer ansehen
          <span className="material-symbols-outlined text-base leading-none ml-2 align-middle">arrow_forward</span>
        </Link>
        <button
          onClick={onClose}
          className="w-full py-4 px-6 rounded-full font-bold text-sm tracking-wider uppercase border border-[#2D3139] text-[#e2e2e9] hover:border-[#D95D39] transition-colors"
        >
          Schliessen
        </button>
      </div>
    </div>
  );
}

// ─── Main wizard orchestrator ─────────────────────────────────────────────────

function Wizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<WizardStep>("name");
  const [data, setData] = useState<WizardData>(defaultData);

  const merge = (updates: Partial<WizardData>) => setData((d) => ({ ...d, ...updates }));

  const afterModus = (modus: Modus): WizardStep =>
    modus === "beratung" ? "kontext" : "leistungen";

  const backFrom = (current: WizardStep): WizardStep => {
    const map: Partial<Record<WizardStep, WizardStep>> = {
      modus: "name",
      kontext: "modus",
      empfehlung: "kontext",
      leistungen: "modus",
      budget: data.modus === "beratung" ? "empfehlung" : "leistungen",
      zeitrahmen: "budget",
    };
    return map[current] ?? "name";
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0D0F14] overflow-y-auto">
      <header className="fixed top-0 left-0 right-0 h-20 bg-[#0D0F14]/90 backdrop-blur border-b border-[#2D3139] flex items-center justify-between px-6 z-50">
        <span className="font-heading text-xl text-[#e2e2e9] tracking-wider uppercase">
          Freelance.ch
        </span>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full border border-[#2D3139] flex items-center justify-center text-[#e2e2e9] hover:border-[#D95D39] transition-colors"
          aria-label="Schliessen"
        >
          <span className="material-symbols-outlined text-xl leading-none">close</span>
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-28 pb-16">
        <StepIndicator step={step} modus={data.modus} />

        {step === "name" && (
          <StepName
            initial={data.name}
            onNext={(name) => { merge({ name }); setStep("modus"); }}
            onClose={onClose}
          />
        )}

        {step === "modus" && (
          <StepModus
            onSelect={(modus) => { merge({ modus }); setStep(afterModus(modus)); }}
            onBack={() => setStep(backFrom("modus"))}
          />
        )}

        {step === "kontext" && (
          <StepKontext
            initial={data.beschreibung}
            onNext={(beschreibung) => { merge({ beschreibung }); setStep("empfehlung"); }}
            onBack={() => setStep(backFrom("kontext"))}
          />
        )}

        {step === "empfehlung" && (
          <StepEmpfehlung
            beschreibung={data.beschreibung}
            onNext={(leistungen) => { merge({ leistungen }); setStep("budget"); }}
            onBack={() => setStep(backFrom("empfehlung"))}
          />
        )}

        {step === "leistungen" && (
          <StepLeistungen
            initial={data.leistungen}
            onNext={(leistungen) => { merge({ leistungen }); setStep("budget"); }}
            onBack={() => setStep(backFrom("leistungen"))}
          />
        )}

        {step === "budget" && (
          <StepBudget
            initial={data.budget}
            onNext={(budget) => { merge({ budget }); setStep("zeitrahmen"); }}
            onBack={() => setStep(backFrom("budget"))}
          />
        )}

        {step === "zeitrahmen" && (
          <StepZeitrahmen
            initial={data.zeitrahmen}
            onNext={(zeitrahmen) => {
              merge({ zeitrahmen });
              erstelleProjekt({
                name: data.name,
                beschreibung: data.beschreibung,
                leistungen: data.leistungen,
                budget: data.budget,
                zeitrahmen,
                modus: data.modus ?? "selbst",
              }).catch(() => {});
              setStep("matching");
            }}
            onBack={() => setStep(backFrom("zeitrahmen"))}
          />
        )}

        {step === "matching" && data.modus === "selbst" && <StepMatching data={data} onClose={onClose} />}
        {step === "matching" && data.modus === "beratung" && <StepAbschluss data={data} onClose={onClose} />}
      </main>
    </div>
  );
}

// ─── Button wrapper (exported) ────────────────────────────────────────────────

export function NeuProjektButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex shrink-0 items-center gap-3 rounded-[var(--radius-button)] bg-[#D95D39] px-8 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-[#D95D39]/25 transition-all duration-200 hover:bg-[#c44e2e] hover:shadow-[#D95D39]/40 hover:shadow-xl active:scale-95"
      >
        <span className="material-symbols-outlined text-xl leading-none transition-transform duration-200 group-hover:rotate-90">
          add
        </span>
        Neues Projekt
      </button>

      {open && <Wizard onClose={() => setOpen(false)} />}
    </>
  );
}
