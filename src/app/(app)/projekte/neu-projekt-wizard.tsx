"use client";

import { useEffect, useState } from "react";
import { PlatzhalterBild } from "@/components/platzhalter-bild";
import { Sternebewertung } from "@/components/sternebewertung";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { erstelleProjekt } from "./actions";
import type { Freelancer } from "@/lib/types/freelancer";
import {
  FragebogenTyp,
  FragebogenAData,
  FragebogenBData,
  StepFragebogenTyp,
  StepFragebogenA,
  StepFragebogenB,
  synthesizeBeschreibung,
} from "./fragebogen";

// ─── Types ─────────────────────────────────────────────────────────────────────

type Modus = "selbst" | "beratung";

type WizardStep =
  | "name"
  | "modus"
  | "fragebogen-typ"
  | "fragebogen"
  | "empfehlung"
  | "aktivitaeten"
  | "freelancer-auswahl"
  | "leistungen"
  | "budget"
  | "zeitrahmen"
  | "matching";

type FreelancerKandidat = {
  id: string;
  name: string;
  rolle: string;
  jahre: number | null;
  bezahlung: number | null;
  bewertung: number | null;
  bildSrc: string | null;
};

type AktivitaetGruppeData = {
  aktivitaet: string;
  rolle: string | null;
  freelancer: FreelancerKandidat[];
};

/** Form der Treffer aus /api/freelancers (siehe getFreelancerFromDb-Aequivalent dort). */
type FreelancerTreffer = Pick<
  Freelancer,
  "id" | "name" | "rolle" | "seitJahren" | "bildSrc" | "rating"
>;

type KiCache = {
  strategie: string | null;
  leistungen: string[];
  tipps: { icon: string; text: string }[];
  freelancer: FreelancerTreffer[];
  flEmpfehlung: string | null;
  aktivitaeten: string[];
};

type WizardData = {
  name: string;
  modus: Modus | null;
  beschreibung: string;
  leistungen: string[];
  budget: string | null;
  zeitrahmen: string | null;
  fragebogenTyp: FragebogenTyp | null;
  fragebogenA: FragebogenAData | null;
  fragebogenB: FragebogenBData | null;
  aktivitaeten: string[];
  kiCache: KiCache | null;
  flAuswahlCache: AktivitaetGruppeData[] | null;
  selectedFreelancerIds: string[];
};

const defaultData: WizardData = {
  name: "",
  modus: null,
  beschreibung: "",
  leistungen: [],
  budget: null,
  zeitrahmen: null,
  fragebogenTyp: null,
  fragebogenA: null,
  fragebogenB: null,
  aktivitaeten: [],
  kiCache: null,
  flAuswahlCache: null,
  selectedFreelancerIds: [],
};

// Visual step number + total for indicator, depends on path
function visualStep(step: WizardStep, modus: Modus | null): { current: number; total: number } {
  const withBeratung: WizardStep[] = [
    "name",
    "modus",
    "fragebogen-typ",
    "empfehlung",
    "aktivitaeten",
    "freelancer-auswahl",
  ];
  const ohnBeratung: WizardStep[] = [
    "name",
    "modus",
    "leistungen",
    "budget",
    "zeitrahmen",
    "freelancer-auswahl",
  ];
  const sequence = modus === "beratung" ? withBeratung : ohnBeratung;
  const idx = sequence.indexOf(step);
  return { current: idx + 1, total: sequence.length };
}

// ─── Shared atoms ──────────────────────────────────────────────────────────────

function StepIndicator({ step, modus }: { step: WizardStep; modus: Modus | null }) {
  if (
    step === "matching" ||
    step === "empfehlung" ||
    step === "fragebogen" ||
    step === "freelancer-auswahl"
  )
    return null;
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

function StepModus({ onSelect, onBack }: { onSelect: (modus: Modus) => void; onBack: () => void }) {
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
          möglich — Zielgruppe, Ziel, Branche, bisherige Massnahmen. Je mehr Details, desto präziser
          die Empfehlung.
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
  if (/instagram|tiktok|social|reels|stories/.test(t))
    hits.push("Social Media", "Content Creation");
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
  {
    icon: "description",
    text: "Erstelle ein klares Briefing mit Zielen, Zielgruppe und Deadlines.",
  },
  {
    icon: "bar_chart",
    text: "Definiere messbare KPIs vor Projektstart (Reichweite, Conversions, etc.).",
  },
  { icon: "handshake", text: "Kläre Nutzungsrechte für alle erstellten Inhalte im Voraus." },
];

function StepEmpfehlung({
  beschreibung,
  fragebogenTyp,
  fragebogenA,
  fragebogenB,
  cache,
  onNext,
  onBack,
}: {
  beschreibung: string;
  fragebogenTyp: import("./fragebogen").FragebogenTyp | null;
  fragebogenA: import("./fragebogen").FragebogenAData | null;
  fragebogenB: import("./fragebogen").FragebogenBData | null;
  cache: KiCache | null;
  onNext: (leistungen: string[], aktivitaeten: string[], cache: KiCache) => void;
  onBack: () => void;
}) {
  const [loading, setLoading] = useState(cache === null);
  const [strategie, setStrategie] = useState<string | null>(cache?.strategie ?? null);
  const [recommended, setRecommended] = useState<string[]>(cache?.leistungen ?? []);
  const [selected, setSelected] = useState<string[]>(cache?.leistungen ?? []);
  const [tipps, setTipps] = useState<{ icon: string; text: string }[]>(cache?.tipps ?? []);
  const [freelancer, setFreelancer] = useState<FreelancerTreffer[]>(cache?.freelancer ?? []);
  const [flEmpfehlung, setFlEmpfehlung] = useState<string | null>(cache?.flEmpfehlung ?? null);
  const [aktivitaeten, setAktivitaeten] = useState<string[]>(cache?.aktivitaeten ?? []);

  useEffect(() => {
    if (cache !== null) return;
    const icons = ["description", "bar_chart", "handshake"];

    (async () => {
      try {
        // Step 1: ki-analyse → get recommended leistungen first
        let leistungen: string[] = [];
        try {
          const kiData = await fetch("/api/ki-analyse", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fragebogenTyp, fragebogenA, fragebogenB, beschreibung }),
          }).then((r) => r.json());
          if (typeof kiData.strategie === "string" && kiData.strategie.trim())
            setStrategie(kiData.strategie.trim());
          const valid = ((kiData.leistungen as string[]) ?? []).filter((l) =>
            ALLE_LEISTUNGEN_LABELS.includes(l),
          );
          leistungen = valid.length > 0 ? valid : empfohleneleistungen(beschreibung);
          setRecommended(leistungen);
          setSelected(leistungen);
          const rawTipps =
            Array.isArray(kiData.tipps) && kiData.tipps.length > 0 ? kiData.tipps : null;
          setTipps(
            rawTipps
              ? rawTipps
                  .slice(0, 3)
                  .map((text: string, i: number) => ({ icon: icons[i] ?? "lightbulb", text }))
              : TIPPS,
          );
        } catch {
          leistungen = empfohleneleistungen(beschreibung);
          setRecommended(leistungen);
          setSelected(leistungen);
          setTipps(TIPPS);
        }

        // Step 2: freelancer-analyse with the concrete leistungen from ki-analyse
        try {
          const flData = await fetch("/api/freelancer-analyse", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ frage: beschreibung, leistungen }),
          }).then((r) => r.json());
          const ids: string[] = Array.isArray(flData.freelancer_ids) ? flData.freelancer_ids : [];
          if (ids.length > 0) {
            const fl = await fetch(`/api/freelancers?ids=${ids.join(",")}`).then((r) => r.json());
            setFreelancer(Array.isArray(fl) ? fl : []);
          }
          if (typeof flData.empfehlung === "string" && flData.empfehlung.trim())
            setFlEmpfehlung(flData.empfehlung.trim());
          if (Array.isArray(flData.aktivitaeten)) setAktivitaeten(flData.aktivitaeten);
        } catch {}
      } finally {
        setLoading(false);
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = (v: string) =>
    setSelected((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));

  if (loading) {
    return (
      <div className="w-full max-w-2xl flex flex-col items-center justify-center py-20">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D95D39]/10 border border-[#D95D39]/30 mb-8">
          <span className="material-symbols-outlined text-[#D95D39] text-base leading-none animate-spin">
            autorenew
          </span>
          <span className="text-xs font-semibold tracking-widest uppercase text-[#D95D39]">
            KI analysiert...
          </span>
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
        <span className="material-symbols-outlined text-[#D95D39] text-base leading-none">
          auto_awesome
        </span>
        <span className="text-xs font-semibold tracking-widest uppercase text-[#D95D39]">
          KI-Analyse
        </span>
      </div>

      <h1 className="font-heading text-5xl text-[#e2e2e9] mb-4 text-center tracking-wide">
        Unsere Empfehlung
      </h1>

      {strategie ? (
        <div className="w-full flex gap-3 items-start bg-[#1A1D24] border border-[#D95D39]/30 rounded-xl px-5 py-4 mb-10">
          <span className="material-symbols-outlined text-[#D95D39] text-xl leading-none mt-0.5 flex-shrink-0">
            auto_awesome
          </span>
          <p className="text-[#e2e2e9] text-sm leading-relaxed">{strategie}</p>
        </div>
      ) : (
        <p className="text-[#dfc0b7] text-base mb-10 text-center">
          Basierend auf deinen Angaben empfehlen wir dir folgende Leistungen und Freelancer.
        </p>
      )}

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
                  <span className="material-symbols-outlined text-sm leading-none">
                    auto_awesome
                  </span>
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
      {(freelancer.length > 0 || flEmpfehlung) && (
        <div className="w-full mb-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#dfc0b7] mb-4">
            Passende Freelancer
          </p>
          {flEmpfehlung && (
            <p className="text-[#dfc0b7] text-sm mb-4 leading-relaxed">{flEmpfehlung}</p>
          )}
          {freelancer.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {freelancer.map((f) => (
                <Link
                  key={f.id}
                  href={`/freelancer/${f.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center bg-[#1A1D24] border border-[#2D3139] rounded-xl p-4 text-center hover:border-[#D95D39]/50 transition-colors"
                >
                  <div className="relative mb-3 w-full overflow-hidden rounded-lg aspect-square">
                    <PlatzhalterBild
                      alt={`Portrait von ${f.name}`}
                      radius="card"
                      src={f.bildSrc}
                      sizes="(min-width: 768px) 33vw, 50vw"
                      className="absolute inset-0 h-full w-full"
                    />
                  </div>
                  <p className="font-bold text-[#e2e2e9] text-sm mb-0.5 leading-tight">{f.name}</p>
                  <p className="text-[#dfc0b7] text-xs mb-2 leading-tight">{f.rolle}</p>
                  {f.rating != null && (
                    <div className="text-[#e2e2e9] text-sm" aria-hidden="false">
                      <Sternebewertung wert={f.rating} />
                    </div>
                  )}
                  <div className="mt-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#D95D39]/10 text-[#D95D39] border border-[#D95D39]/30">
                    Empfohlen
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empfohlene Aktivitäten */}
      {aktivitaeten.length > 0 && (
        <div className="w-full mb-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#dfc0b7] mb-4">
            Empfohlene Marketing-Aktivitäten
          </p>
          <div className="flex flex-col gap-3">
            {aktivitaeten.map((a, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-[#1A1D24] border border-[#2D3139] rounded-xl px-4 py-3"
              >
                <span className="material-symbols-outlined text-[#D95D39] text-base leading-none mt-0.5 flex-shrink-0">
                  campaign
                </span>
                <p className="text-[#dfc0b7] text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weitere Tipps */}
      <div className="w-full mb-2">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#dfc0b7] mb-4">
          Weitere Empfehlungen
        </p>
        <div className="flex flex-col gap-3">
          {tipps.map((t, i) => (
            <div
              key={i}
              className="flex items-start gap-3 bg-[#1A1D24] border border-[#2D3139] rounded-xl px-4 py-3"
            >
              <span className="material-symbols-outlined text-[#D95D39] text-base leading-none mt-0.5 flex-shrink-0">
                {t.icon}
              </span>
              <p className="text-[#dfc0b7] text-sm leading-relaxed">{t.text}</p>
            </div>
          ))}
        </div>
      </div>

      <NavButtons
        onNext={() =>
          onNext(selected, aktivitaeten, {
            strategie,
            leistungen: selected,
            tipps,
            freelancer,
            flEmpfehlung,
            aktivitaeten,
          })
        }
        onBack={onBack}
        nextDisabled={selected.length === 0}
        nextLabel="Weiter"
      />
    </div>
  );
}

function StepAktivitaeten({
  initial,
  onNext,
  onBack,
}: {
  initial: string[];
  onNext: (aktivitaeten: string[]) => void;
  onBack: () => void;
}) {
  const [selected, setSelected] = useState<string[]>(initial);
  const toggle = (v: string) =>
    setSelected((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));

  return (
    <div className="w-full max-w-2xl flex flex-col items-center">
      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D95D39]/10 border border-[#D95D39]/30 mb-6">
        <span className="material-symbols-outlined text-[#D95D39] text-base leading-none">
          auto_awesome
        </span>
        <span className="text-xs font-semibold tracking-widest uppercase text-[#D95D39]">
          KI-Empfehlung
        </span>
      </div>
      <h1 className="font-heading text-5xl text-[#e2e2e9] mb-4 text-center tracking-wide">
        Empfohlene Aktivitäten
      </h1>
      <p className="text-[#dfc0b7] text-base mb-10 text-center">
        Wähle die Marketing-Aktivitäten, die zu deinem Projekt passen.
      </p>
      <div className="flex flex-col gap-3 w-full mb-2">
        {initial.map((a) => {
          const active = selected.includes(a);
          return (
            <button
              key={a}
              onClick={() => toggle(a)}
              className={`w-full flex items-center gap-3 bg-[#1A1D24] border-2 rounded-xl px-4 py-3 text-left transition-all focus:outline-none ${
                active ? "border-[#D95D39]" : "border-[#2D3139] hover:border-[#D95D39]/50"
              }`}
            >
              <span
                className={`material-symbols-outlined text-base leading-none flex-shrink-0 ${active ? "text-[#D95D39]" : "text-[#4A4D55]"}`}
              >
                {active ? "check_circle" : "radio_button_unchecked"}
              </span>
              <p className="text-[#e2e2e9] text-sm font-medium">{a}</p>
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

function StepFreelancerAuswahl({
  aktivitaeten,
  initialGruppen,
  initialSelected,
  onDone,
  onBack,
  apiPath = "/api/aktivitaet-freelancers",
}: {
  aktivitaeten: string[];
  initialGruppen: AktivitaetGruppeData[] | null;
  initialSelected: string[];
  onDone: (gruppen: AktivitaetGruppeData[], selectedIds: string[]) => void;
  onBack: () => void;
  apiPath?: string;
}) {
  const [loading, setLoading] = useState(initialGruppen === null);
  const [gruppen, setGruppen] = useState<AktivitaetGruppeData[]>(initialGruppen ?? []);
  const [selected, setSelected] = useState<string[]>(initialSelected);

  useEffect(() => {
    if (initialGruppen !== null) return;
    fetch(apiPath, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aktivitaeten }),
    })
      .then((r) => r.json())
      .then((data) => setGruppen(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleFreelancer = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <div className="w-full max-w-2xl flex flex-col items-center">
      <h1 className="font-heading text-5xl text-[#e2e2e9] mb-4 text-center tracking-wide">
        Freelancer auswählen
      </h1>
      <p className="text-[#dfc0b7] text-base mb-10 text-center">
        Wähle passende Freelancer pro Aktivität für dein Projekt.
      </p>

      {loading ? (
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D95D39]/10 border border-[#D95D39]/30 mb-8">
          <span className="material-symbols-outlined text-[#D95D39] text-base leading-none animate-spin">
            autorenew
          </span>
          <span className="text-xs font-semibold tracking-widest uppercase text-[#D95D39]">
            Freelancer werden geladen...
          </span>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-10 mb-2">
          {gruppen.map((g) => (
            <div key={g.aktivitaet} className="w-full">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-[#D95D39] text-base leading-none">
                  campaign
                </span>
                <p className="text-xs font-semibold tracking-widest uppercase text-[#dfc0b7]">
                  {g.aktivitaet}
                </p>
              </div>
              {g.freelancer.length === 0 ? (
                <p className="text-[#4A4D55] text-sm">Keine Freelancer gefunden.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {g.freelancer.map((f) => {
                    const isSelected = selected.includes(f.id);
                    return (
                      <div key={f.id} className="relative">
                        {/* Auswahl-Button: ganze Karte */}
                        <button
                          onClick={() => toggleFreelancer(f.id)}
                          className={`w-full flex flex-col items-center bg-[#1A1D24] border-2 rounded-xl p-4 text-center transition-all focus:outline-none ${
                            isSelected
                              ? "border-[#D95D39]"
                              : "border-[#2D3139] hover:border-[#D95D39]/50"
                          }`}
                        >
                          <div className="relative mb-3 w-full overflow-hidden rounded-lg aspect-square">
                            <PlatzhalterBild
                              alt={`Portrait von ${f.name}`}
                              radius="card"
                              src={f.bildSrc ?? undefined}
                              sizes="(min-width: 640px) 33vw, 50vw"
                              className="absolute inset-0 h-full w-full"
                            />
                          </div>
                          <p className="font-bold text-[#e2e2e9] text-sm mb-0.5 leading-tight">
                            {f.name}
                          </p>
                          <p className="text-[#dfc0b7] text-xs mb-2 leading-tight">{f.rolle}</p>
                          <div className="flex flex-col gap-1 w-full">
                            {f.bewertung !== null && (
                              <div className="flex items-center justify-center gap-1">
                                <span className="material-symbols-outlined text-[#D95D39] text-xs leading-none">
                                  star
                                </span>
                                <span className="text-[#dfc0b7] text-xs">
                                  {f.bewertung.toFixed(1)}
                                </span>
                              </div>
                            )}
                            {f.jahre !== null && (
                              <p className="text-[#4A4D55] text-xs">{f.jahre} J. Erfahrung</p>
                            )}
                            {f.bezahlung !== null && (
                              <p className="text-[#4A4D55] text-xs">
                                Ø CHF {f.bezahlung.toLocaleString("de-CH")}
                              </p>
                            )}
                          </div>
                        </button>
                        {/* Auswahl-Checkmark */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#D95D39] flex items-center justify-center pointer-events-none">
                            <span className="material-symbols-outlined text-white text-xs leading-none">
                              check
                            </span>
                          </div>
                        )}
                        {/* Profil-Link */}
                        <Link
                          href={`/freelancer/${f.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="absolute top-2 left-2 w-6 h-6 rounded-full bg-[#0D0F14]/80 border border-[#2D3139] flex items-center justify-center hover:border-[#D95D39] transition-colors"
                          title="Profil ansehen"
                        >
                          <span
                            className="material-symbols-outlined text-[#e2e2e9] leading-none"
                            style={{ fontSize: "12px" }}
                          >
                            open_in_new
                          </span>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selected.length > 0 && (
        <div className="w-full mt-4 mb-2 flex items-center gap-2 bg-[#D95D39]/10 border border-[#D95D39]/30 rounded-xl px-4 py-3">
          <span className="material-symbols-outlined text-[#D95D39] text-base leading-none">
            group
          </span>
          <p className="text-[#e2e2e9] text-sm font-semibold">
            {selected.length} Freelancer ausgewählt
          </p>
        </div>
      )}

      <NavButtons
        onNext={() => onDone(gruppen, selected)}
        onBack={onBack}
        nextLabel="Abschliessen"
        nextDisabled={loading}
      />
    </div>
  );
}

const ALLE_LEISTUNGEN_LABELS = [
  "Videografie",
  "Webprogrammierung",
  "Fotografie",
  "Content Creation",
  "Print Grafik",
  "Web Grafik",
  "Social Media",
  "SEO / SEA",
  "Branding",
  "Copywriting",
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
  const [freelancer, setFreelancer] = useState<FreelancerTreffer[]>([]);
  const [loadingMatch, setLoadingMatch] = useState(true);

  useEffect(() => {
    const frage =
      data.leistungen.length > 0
        ? `Ich suche Freelancer für: ${data.leistungen.join(", ")}.`
        : "Ich suche passende Marketing-Freelancer.";
    fetch("/api/freelancer-analyse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ frage }),
    })
      .then((r) => r.json())
      .then(async (res) => {
        const ids: string[] = Array.isArray(res.freelancer_ids) ? res.freelancer_ids : [];
        if (ids.length > 0) {
          const fl = await fetch(`/api/freelancers?ids=${ids.join(",")}`).then((r) => r.json());
          setFreelancer(Array.isArray(fl) ? fl : []);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingMatch(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        <span className="text-[#D95D39] font-semibold">
          {loadingMatch ? "..." : freelancer.length} Freelancer
        </span>{" "}
        für <span className="text-[#e2e2e9] font-semibold">«{data.name}»</span> gefunden.
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
      {loadingMatch ? (
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D95D39]/10 border border-[#D95D39]/30 mb-8">
          <span className="material-symbols-outlined text-[#D95D39] text-base leading-none animate-spin">
            autorenew
          </span>
          <span className="text-xs font-semibold tracking-widest uppercase text-[#D95D39]">
            Freelancer werden gesucht...
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 w-full mb-8">
          {freelancer.map((f) => (
            <Link
              key={f.id}
              href={`/freelancer/${f.id}`}
              className="flex flex-col items-center bg-[#1A1D24] border border-[#2D3139] rounded-xl p-4 text-center hover:border-[#D95D39]/50 transition-colors"
            >
              <div className="relative mb-3 w-full overflow-hidden rounded-lg aspect-square">
                <PlatzhalterBild
                  alt={`Portrait von ${f.name}`}
                  radius="card"
                  src={f.bildSrc}
                  sizes="33vw"
                  className="absolute inset-0 h-full w-full"
                />
              </div>
              <p className="font-bold text-[#e2e2e9] text-sm mb-0.5 leading-tight">{f.name}</p>
              <p className="text-[#dfc0b7] text-xs mb-2 leading-tight">{f.rolle}</p>
              {f.rating != null && (
                <div className="text-[#e2e2e9] text-sm">
                  <Sternebewertung wert={f.rating} />
                </div>
              )}
              <div className="mt-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#D95D39]/10 text-[#D95D39] border border-[#D95D39]/30">
                Match
              </div>
            </Link>
          ))}
        </div>
      )}
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
        <div className="flex items-center gap-4 bg-[#1A1D24] border border-[#2D3139] rounded-xl px-5 py-3">
          <span className="material-symbols-outlined text-[#D95D39] text-base leading-none flex-shrink-0">
            folder
          </span>
          <span className="text-[#dfc0b7] text-sm w-24 flex-shrink-0">Projekt</span>
          <span className="text-[#e2e2e9] text-sm font-semibold">{data.name}</span>
        </div>
        {data.budget && (
          <div className="flex items-center gap-4 bg-[#1A1D24] border border-[#2D3139] rounded-xl px-5 py-3">
            <span className="material-symbols-outlined text-[#D95D39] text-base leading-none flex-shrink-0">
              payments
            </span>
            <span className="text-[#dfc0b7] text-sm w-24 flex-shrink-0">Budget</span>
            <span className="text-[#e2e2e9] text-sm font-semibold">{data.budget}</span>
          </div>
        )}
        {data.zeitrahmen && (
          <div className="flex items-center gap-4 bg-[#1A1D24] border border-[#2D3139] rounded-xl px-5 py-3">
            <span className="material-symbols-outlined text-[#D95D39] text-base leading-none flex-shrink-0">
              schedule
            </span>
            <span className="text-[#dfc0b7] text-sm w-24 flex-shrink-0">Zeitrahmen</span>
            <span className="text-[#e2e2e9] text-sm font-semibold">{data.zeitrahmen}</span>
          </div>
        )}
        {data.leistungen.length > 0 && (
          <div className="flex items-start gap-4 bg-[#1A1D24] border border-[#2D3139] rounded-xl px-5 py-3">
            <span className="material-symbols-outlined text-[#D95D39] text-base leading-none flex-shrink-0 mt-0.5">
              auto_awesome
            </span>
            <span className="text-[#dfc0b7] text-sm w-24 flex-shrink-0">Leistungen</span>
            <div className="flex flex-wrap gap-2">
              {data.leistungen.map((l) => (
                <span
                  key={l}
                  className="px-2 py-0.5 rounded-full text-xs font-semibold border border-[#D95D39]/40 text-[#D95D39] bg-[#D95D39]/10"
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
        )}
        {data.selectedFreelancerIds.length > 0 && (
          <div className="flex items-center gap-4 bg-[#1A1D24] border border-[#2D3139] rounded-xl px-5 py-3">
            <span className="material-symbols-outlined text-[#D95D39] text-base leading-none flex-shrink-0">
              group
            </span>
            <span className="text-[#dfc0b7] text-sm w-24 flex-shrink-0">Freelancer</span>
            <span className="text-[#e2e2e9] text-sm font-semibold">
              {data.selectedFreelancerIds.length} ausgewählt
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 w-full">
        <Link
          href="/projekte"
          className="w-full py-4 px-6 rounded-full font-bold text-sm tracking-wider uppercase transition-colors bg-[#D95D39] text-white hover:bg-[#c44e2e] text-center"
          onClick={onClose}
        >
          Zu meinen Projekten
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

// ─── Main wizard orchestrator ─────────────────────────────────────────────────

function Wizard({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [step, setStep] = useState<WizardStep>("name");
  const [data, setData] = useState<WizardData>(defaultData);

  const merge = (updates: Partial<WizardData>) => setData((d) => ({ ...d, ...updates }));

  const afterModus = (modus: Modus): WizardStep =>
    modus === "beratung" ? "fragebogen-typ" : "leistungen";

  const backFrom = (current: WizardStep): WizardStep => {
    const map: Partial<Record<WizardStep, WizardStep>> = {
      modus: "name",
      "fragebogen-typ": "modus",
      fragebogen: "fragebogen-typ",
      empfehlung: "fragebogen",
      aktivitaeten: "empfehlung",
      "freelancer-auswahl": data.modus === "selbst" ? "zeitrahmen" : "aktivitaeten",
      leistungen: "modus",
      budget: "leistungen",
      zeitrahmen: "budget",
    };
    return map[current] ?? "name";
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-[#0D0F14] overflow-y-auto">
      <header className="fixed top-0 left-0 right-0 h-20 bg-[#0D0F14]/90 backdrop-blur border-b border-[#2D3139] flex items-center justify-between px-6 z-[200]">
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
            onNext={(name) => {
              merge({ name });
              setStep("modus");
            }}
            onClose={onClose}
          />
        )}

        {step === "modus" && (
          <StepModus
            onSelect={(modus) => {
              merge({ modus });
              setStep(afterModus(modus));
            }}
            onBack={() => setStep(backFrom("modus"))}
          />
        )}

        {step === "fragebogen-typ" && (
          <StepFragebogenTyp
            onSelect={(fragebogenTyp) => {
              merge({ fragebogenTyp });
              setStep("fragebogen");
            }}
            onBack={() => setStep(backFrom("fragebogen-typ"))}
          />
        )}

        {step === "fragebogen" && data.fragebogenTyp === "marke" && (
          <StepFragebogenA
            initial={data.fragebogenA ?? {}}
            onComplete={(fragebogenA) => {
              const beschreibung = synthesizeBeschreibung("marke", fragebogenA);
              merge({ fragebogenA, beschreibung });
              setStep("empfehlung");
            }}
            onBack={() => setStep(backFrom("fragebogen"))}
          />
        )}

        {step === "fragebogen" && data.fragebogenTyp === "produkt" && (
          <StepFragebogenB
            initial={data.fragebogenB ?? {}}
            onComplete={(fragebogenB) => {
              const beschreibung = synthesizeBeschreibung("produkt", null, fragebogenB);
              merge({ fragebogenB, beschreibung });
              setStep("empfehlung");
            }}
            onBack={() => setStep(backFrom("fragebogen"))}
          />
        )}

        {step === "empfehlung" && (
          <StepEmpfehlung
            beschreibung={data.beschreibung}
            fragebogenTyp={data.fragebogenTyp}
            fragebogenA={data.fragebogenA}
            fragebogenB={data.fragebogenB}
            cache={data.kiCache}
            onNext={(leistungen, aktivitaeten, kiCache) => {
              merge({ leistungen, aktivitaeten, kiCache });
              setStep("aktivitaeten");
            }}
            onBack={() => setStep(backFrom("empfehlung"))}
          />
        )}

        {step === "aktivitaeten" && (
          <StepAktivitaeten
            initial={data.aktivitaeten}
            onNext={(aktivitaeten) => {
              merge({ aktivitaeten });
              setStep("freelancer-auswahl");
            }}
            onBack={() => setStep(backFrom("aktivitaeten"))}
          />
        )}

        {step === "freelancer-auswahl" && data.modus === "selbst" && (
          <StepFreelancerAuswahl
            apiPath="/api/leistungen-freelancers"
            aktivitaeten={data.leistungen}
            initialGruppen={data.flAuswahlCache}
            initialSelected={data.selectedFreelancerIds}
            onDone={(gruppen, selectedFreelancerIds) => {
              merge({ flAuswahlCache: gruppen, selectedFreelancerIds });
              const beschreibung =
                data.leistungen.length > 0
                  ? `Gesucht: ${data.leistungen.join(", ")}.${data.budget ? ` Budget: ${data.budget}.` : ""}${data.zeitrahmen ? ` Zeitrahmen: ${data.zeitrahmen}.` : ""}`
                  : "";
              erstelleProjekt({
                name: data.name,
                beschreibung,
                leistungen: data.leistungen,
                budget: data.budget,
                zeitrahmen: data.zeitrahmen,
                modus: "selbst",
                freelancerIds: selectedFreelancerIds,
              }).then((res) => {
                if (res?.error) console.error("erstelleProjekt:", res.error);
                else router.refresh();
              });
              setStep("matching");
            }}
            onBack={() => setStep(backFrom("freelancer-auswahl"))}
          />
        )}

        {step === "freelancer-auswahl" && data.modus === "beratung" && (
          <StepFreelancerAuswahl
            aktivitaeten={data.aktivitaeten}
            initialGruppen={data.flAuswahlCache}
            initialSelected={data.selectedFreelancerIds}
            onDone={(gruppen, selectedFreelancerIds) => {
              merge({ flAuswahlCache: gruppen, selectedFreelancerIds });
              erstelleProjekt({
                name: data.name,
                beschreibung: data.beschreibung,
                leistungen: data.leistungen,
                budget: null,
                zeitrahmen: null,
                modus: "beratung",
                freelancerIds: selectedFreelancerIds,
              }).then((res) => {
                if (res?.error) console.error("erstelleProjekt:", res.error);
                else router.refresh();
              });
              setStep("matching");
            }}
            onBack={() => setStep(backFrom("freelancer-auswahl"))}
          />
        )}

        {step === "leistungen" && (
          <StepLeistungen
            initial={data.leistungen}
            onNext={(leistungen) => {
              merge({ leistungen });
              setStep("budget");
            }}
            onBack={() => setStep(backFrom("leistungen"))}
          />
        )}

        {step === "budget" && (
          <StepBudget
            initial={data.budget}
            onNext={(budget) => {
              merge({ budget });
              setStep("zeitrahmen");
            }}
            onBack={() => setStep(backFrom("budget"))}
          />
        )}

        {step === "zeitrahmen" && (
          <StepZeitrahmen
            initial={data.zeitrahmen}
            onNext={(zeitrahmen) => {
              merge({ zeitrahmen });
              setStep("freelancer-auswahl");
            }}
            onBack={() => setStep(backFrom("zeitrahmen"))}
          />
        )}

        {step === "matching" && <StepAbschluss data={data} onClose={onClose} />}
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
