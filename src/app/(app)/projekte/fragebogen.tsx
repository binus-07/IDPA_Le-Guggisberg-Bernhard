"use client";

import { useState, useEffect } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export type FragebogenTyp = "marke" | "produkt";

export type FragebogenAData = {
  unternehmenstyp: string;
  unternehmenstypSonstige?: string;
  unternehmensgroesse: string;
  markenziel: string;
  zielgruppeSegment: string[];
  zielgruppeAlter: string[];
  zielgruppeBeschreibung: string;
  cicdStatus: string;
  cicdEinhaltung?: string;
  cicdVorgaben?: string;
  kanaele: string[];
  tonalitaet: string;
  markenstärke: string;
  zusammenarbeit: string;
  budget?: string;
};

export type FragebogenBData = {
  angebotstyp: string;
  produktstatus: string;
  marketingziel: string;
  zielgruppeSegment: string;
  zielgruppeAlter: string[];
  zielgruppeBeschreibung: string;
  usp: string;
  preissegment: string;
  cicdStatus: string;
  cicdEinhaltung?: string;
  cicdVorgaben?: string;
  leistungen: string[];
  zeitrahmen: string;
  zusammenarbeit: string;
  budget?: string;
};

const STORAGE_KEY = "idpa_wizard_fragebogen";

// ─── Shared atoms ────────────────────────────────────────────────────────────

function FBProgress({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full max-w-lg mb-8 text-center">
      <span className="text-xs font-semibold tracking-widest uppercase text-[#dfc0b7] block mb-3">
        Frage {current} von {total}
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

function FBNav({
  onNext,
  onBack,
  disabled = false,
  nextLabel = "Weiter",
}: {
  onNext: () => void;
  onBack: () => void;
  disabled?: boolean;
  nextLabel?: string;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 px-6 pb-8 pt-6 bg-gradient-to-t from-[#0D0F14] via-[#0D0F14]/95 to-transparent pointer-events-none">
      <div className="flex flex-col gap-3 max-w-lg mx-auto pointer-events-auto">
        <button
          onClick={onNext}
          disabled={disabled}
          className={`w-full py-4 px-6 rounded-full font-bold text-sm tracking-wider uppercase transition-colors ${
            disabled
              ? "bg-[#2D3139] text-[#7A7D85] cursor-not-allowed"
              : "bg-[#D95D39] text-white hover:bg-[#c44e2e]"
          }`}
        >
          {nextLabel}
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

function FBRadio({
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

function FBTag({
  label,
  active,
  onToggle,
}: {
  label: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`px-4 py-2 rounded-full border text-sm font-semibold tracking-wide transition-colors focus:outline-none ${
        active
          ? "border-[#D95D39] bg-[#D95D39]/10 text-[#D95D39]"
          : "border-[#2D3139] text-[#e2e2e9] hover:border-[#D95D39]/50"
      }`}
    >
      {label}
    </button>
  );
}

function FBTextarea({
  value,
  onChange,
  placeholder,
  rows = 6,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      autoFocus
      className="w-full bg-[#0D0F14] border border-[#2D3139] rounded-xl px-5 py-4 text-[#e2e2e9] placeholder-[#4A4D55] text-base focus:border-[#D95D39] focus:outline-none transition-colors resize-none"
    />
  );
}

// ─── Fragebogen A (Marke) ─────────────────────────────────────────────────────

type QKeyA =
  | "unternehmenstyp"
  | "unternehmensgroesse"
  | "markenziel"
  | "zielgruppe-segment"
  | "zielgruppe-alter"
  | "zielgruppe-text"
  | "cicd-status"
  | "cicd-einhaltung"
  | "cicd-vorgaben"
  | "kanaele"
  | "tonalitaet"
  | "markenstärke"
  | "zusammenarbeit"
  | "budget";

function getSeqA(data: Partial<FragebogenAData>): QKeyA[] {
  const seq: QKeyA[] = [
    "unternehmenstyp",
    "unternehmensgroesse",
    "markenziel",
    "zielgruppe-segment",
    "zielgruppe-alter",
    "zielgruppe-text",
    "cicd-status",
  ];
  if (data.cicdStatus === "ja-vollständig" || data.cicdStatus === "teilweise") {
    seq.push("cicd-einhaltung", "cicd-vorgaben");
  }
  seq.push("kanaele", "tonalitaet", "markenstärke", "zusammenarbeit");
  if (data.zusammenarbeit === "fertiger-plan" || data.zusammenarbeit === "auswahl-3") {
    seq.push("budget");
  }
  return seq;
}

function canProceedA(key: QKeyA, data: Partial<FragebogenAData>): boolean {
  switch (key) {
    case "unternehmenstyp":
      if (!data.unternehmenstyp) return false;
      if (data.unternehmenstyp === "Andere" && !data.unternehmenstypSonstige?.trim()) return false;
      return true;
    case "unternehmensgroesse": return !!data.unternehmensgroesse;
    case "markenziel": return !!data.markenziel;
    case "zielgruppe-segment": return (data.zielgruppeSegment?.length ?? 0) > 0;
    case "zielgruppe-alter": return (data.zielgruppeAlter?.length ?? 0) > 0;
    case "zielgruppe-text": return !!data.zielgruppeBeschreibung?.trim();
    case "cicd-status": return !!data.cicdStatus;
    case "cicd-einhaltung": return !!data.cicdEinhaltung;
    case "cicd-vorgaben": return true;
    case "kanaele": return (data.kanaele?.length ?? 0) > 0;
    case "tonalitaet": return !!data.tonalitaet;
    case "markenstärke": return !!data.markenstärke?.trim();
    case "zusammenarbeit": return !!data.zusammenarbeit;
    case "budget": return !!data.budget;
    default: return true;
  }
}

function renderQA(
  key: QKeyA,
  data: Partial<FragebogenAData>,
  set: (u: Partial<FragebogenAData>) => void
): React.ReactNode {
  switch (key) {
    case "unternehmenstyp": {
      const opts = [
        "Lokales Gewerbe / Handwerk",
        "Gastronomie / Food & Beverage",
        "Dienstleistung / Beratung",
        "Gesundheit / Beauty / Wellness",
        "Technologie / SaaS",
        "Bildung / Coaching",
        "Non-Profit / Verein",
        "Andere",
      ];
      return (
        <div className="w-full max-w-lg flex flex-col items-center">
          <h1 className="font-heading text-4xl text-[#e2e2e9] mb-3 text-center tracking-wide">Wer seid ihr?</h1>
          <p className="text-[#dfc0b7] text-base mb-8 text-center">Was beschreibt euer Unternehmen am besten?</p>
          <div className="flex flex-col gap-3 w-full">
            {opts.map((o) => (
              <FBRadio key={o} label={o} selected={data.unternehmenstyp === o} onSelect={() => set({ unternehmenstyp: o })} />
            ))}
          </div>
          {data.unternehmenstyp === "Andere" && (
            <input
              type="text"
              value={data.unternehmenstypSonstige ?? ""}
              onChange={(e) => set({ unternehmenstypSonstige: e.target.value })}
              placeholder="Beschreibt euer Unternehmen..."
              autoFocus
              className="w-full mt-4 bg-[#0D0F14] border border-[#2D3139] rounded-xl px-5 py-4 text-[#e2e2e9] placeholder-[#4A4D55] text-base focus:border-[#D95D39] focus:outline-none transition-colors"
            />
          )}
        </div>
      );
    }
    case "unternehmensgroesse": {
      const opts = ["Solo / 1 Person", "2–10 Mitarbeitende", "11–50 Mitarbeitende", "51–200 Mitarbeitende", "200+"];
      return (
        <div className="w-full max-w-lg flex flex-col items-center">
          <h1 className="font-heading text-4xl text-[#e2e2e9] mb-3 text-center tracking-wide">Unternehmensgrösse</h1>
          <p className="text-[#dfc0b7] text-base mb-8 text-center">Wie viele Mitarbeitende habt ihr?</p>
          <div className="flex flex-col gap-3 w-full">
            {opts.map((o) => (
              <FBRadio key={o} label={o} selected={data.unternehmensgroesse === o} onSelect={() => set({ unternehmensgroesse: o })} />
            ))}
          </div>
        </div>
      );
    }
    case "markenziel": {
      const opts = [
        "Markenbekanntheit aufbauen (wir sind noch kaum bekannt)",
        "Markenimage verbessern / repositionieren",
        "Vertrauen & Glaubwürdigkeit stärken",
        "Neue Zielgruppe für die Marke erschliessen",
        "Employer Branding (als Arbeitgeber attraktiver werden)",
        "Community aufbauen & Loyalität fördern",
      ];
      return (
        <div className="w-full max-w-lg flex flex-col items-center">
          <h1 className="font-heading text-4xl text-[#e2e2e9] mb-3 text-center tracking-wide">Markenziel</h1>
          <p className="text-[#dfc0b7] text-base mb-8 text-center">Was ist euer wichtigstes Ziel für die Marke?</p>
          <div className="flex flex-col gap-3 w-full">
            {opts.map((o) => (
              <FBRadio key={o} label={o} selected={data.markenziel === o} onSelect={() => set({ markenziel: o })} />
            ))}
          </div>
        </div>
      );
    }
    case "zielgruppe-segment": {
      const opts = ["Privatkunden (B2C)", "Unternehmen (B2B)", "Retail (B2R)"];
      const toggle = (v: string) => {
        const cur = data.zielgruppeSegment ?? [];
        set({ zielgruppeSegment: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] });
      };
      return (
        <div className="w-full max-w-lg flex flex-col items-center">
          <h1 className="font-heading text-4xl text-[#e2e2e9] mb-3 text-center tracking-wide">Zielgruppe</h1>
          <p className="text-[#dfc0b7] text-base mb-8 text-center">Wer soll eure Marke kennen und lieben? (Mehrfachauswahl möglich)</p>
          <div className="flex flex-wrap gap-3 justify-center w-full">
            {opts.map((o) => (
              <FBTag key={o} label={o} active={(data.zielgruppeSegment ?? []).includes(o)} onToggle={() => toggle(o)} />
            ))}
          </div>
        </div>
      );
    }
    case "zielgruppe-alter": {
      const opts = ["Unter 18", "18–25 (Gen-Z)", "26–35 (Millennials)", "36–50", "50+"];
      const toggle = (v: string) => {
        const cur = data.zielgruppeAlter ?? [];
        set({ zielgruppeAlter: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] });
      };
      return (
        <div className="w-full max-w-lg flex flex-col items-center">
          <h1 className="font-heading text-4xl text-[#e2e2e9] mb-3 text-center tracking-wide">Altersgruppe</h1>
          <p className="text-[#dfc0b7] text-base mb-8 text-center">Welche Altersgruppe ist eure Hauptzielgruppe? (Mehrfachauswahl möglich)</p>
          <div className="flex flex-wrap gap-3 justify-center w-full">
            {opts.map((o) => (
              <FBTag key={o} label={o} active={(data.zielgruppeAlter ?? []).includes(o)} onToggle={() => toggle(o)} />
            ))}
          </div>
        </div>
      );
    }
    case "zielgruppe-text":
      return (
        <div className="w-full max-w-lg flex flex-col items-center">
          <h1 className="font-heading text-4xl text-[#e2e2e9] mb-3 text-center tracking-wide">Wunschzielgruppe</h1>
          <p className="text-[#dfc0b7] text-base mb-8 text-center">
            Beschreibt eure Wunschzielgruppe. Was sind ihre Werte, Interessen und Lebensweise? Was sollen sie über eure Marke denken und fühlen?
          </p>
          <FBTextarea
            value={data.zielgruppeBeschreibung ?? ""}
            onChange={(v) => set({ zielgruppeBeschreibung: v })}
            placeholder="z. B. Junge, urbane Frauen zwischen 25 und 35, die Wert auf Nachhaltigkeit legen..."
          />
        </div>
      );
    case "cicd-status": {
      const opts = [
        { value: "ja-vollständig", label: "Ja, vollständig", desc: "Logo, Farben, Schriften, Guidelines vorhanden" },
        { value: "teilweise", label: "Teilweise", desc: "Logo vorhanden, aber keine konsistenten Guidelines" },
        { value: "kaum", label: "Kaum", desc: "Ein Logo, mehr nicht" },
        { value: "nein-neu", label: "Nein – komplett neu aufbauen", desc: "Wir brauchen ein komplett neues CI/CD" },
        { value: "nein-keins", label: "Nein, wir wollen keins", desc: "" },
      ];
      return (
        <div className="w-full max-w-lg flex flex-col items-center">
          <h1 className="font-heading text-4xl text-[#e2e2e9] mb-3 text-center tracking-wide">Corporate Design</h1>
          <p className="text-[#dfc0b7] text-base mb-8 text-center">Habt ihr bereits ein Corporate Design / eine visuelle Identität?</p>
          <div className="flex flex-col gap-3 w-full">
            {opts.map((o) => (
              <FBRadio
                key={o.value}
                label={o.label}
                description={o.desc || undefined}
                selected={data.cicdStatus === o.value}
                onSelect={() => set({ cicdStatus: o.value, cicdEinhaltung: undefined, cicdVorgaben: undefined })}
              />
            ))}
          </div>
        </div>
      );
    }
    case "cicd-einhaltung": {
      const opts = [
        { value: "strikt", label: "Strikt", desc: "Bitte alles exakt nach unseren Vorgaben umsetzen" },
        { value: "flexibel", label: "Flexibel", desc: "Grundelemente behalten, Rest darf weiterentwickelt werden" },
        { value: "offen", label: "Offen", desc: "Ihr dürft auch Verbesserungsvorschläge einbringen" },
      ];
      return (
        <div className="w-full max-w-lg flex flex-col items-center">
          <h1 className="font-heading text-4xl text-[#e2e2e9] mb-3 text-center tracking-wide">CI/CD Einhaltung</h1>
          <p className="text-[#dfc0b7] text-base mb-8 text-center">Wie stark soll das bestehende CI/CD eingehalten werden?</p>
          <div className="flex flex-col gap-3 w-full">
            {opts.map((o) => (
              <FBRadio key={o.value} label={o.label} description={o.desc} selected={data.cicdEinhaltung === o.value} onSelect={() => set({ cicdEinhaltung: o.value })} />
            ))}
          </div>
        </div>
      );
    }
    case "cicd-vorgaben":
      return (
        <div className="w-full max-w-lg flex flex-col items-center">
          <h1 className="font-heading text-4xl text-[#e2e2e9] mb-3 text-center tracking-wide">CI/CD Vorgaben</h1>
          <p className="text-[#dfc0b7] text-base mb-2 text-center">
            Spezifische Vorgaben, Farben, Schriften oder Dos & Don'ts?
          </p>
          <p className="text-[#4A4D55] text-sm mb-8 text-center">(Optional – Datei-Upload folgt)</p>
          <FBTextarea
            value={data.cicdVorgaben ?? ""}
            onChange={(v) => set({ cicdVorgaben: v })}
            placeholder="z. B. Hauptfarbe #D95D39, Schrift: Inter, kein Comic Sans..."
            rows={5}
          />
        </div>
      );
    case "kanaele": {
      const opts = ["Instagram", "Facebook", "TikTok", "LinkedIn", "YouTube", "Podcast", "PR & Medien", "Events", "Website", "Retail Media", "Noch nichts"];
      const toggle = (v: string) => {
        const cur = data.kanaele ?? [];
        set({ kanaele: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] });
      };
      return (
        <div className="w-full max-w-lg flex flex-col items-center">
          <h1 className="font-heading text-4xl text-[#e2e2e9] mb-3 text-center tracking-wide">Kanalhistorie</h1>
          <p className="text-[#dfc0b7] text-base mb-8 text-center">Welche Kanäle nutzt ihr aktuell für die Marke? (Mehrfachauswahl möglich)</p>
          <div className="flex flex-wrap gap-3 justify-center w-full">
            {opts.map((o) => (
              <FBTag key={o} label={o} active={(data.kanaele ?? []).includes(o)} onToggle={() => toggle(o)} />
            ))}
          </div>
        </div>
      );
    }
    case "tonalitaet": {
      const opts = [
        "Professionell & seriös",
        "Freundlich & nahbar",
        "Mutig & provokativ",
        "Verspielt & kreativ",
        "Inspirierend & emotional",
        "Minimalistisch & premium",
      ];
      return (
        <div className="w-full max-w-lg flex flex-col items-center">
          <h1 className="font-heading text-4xl text-[#e2e2e9] mb-3 text-center tracking-wide">Ton & Persönlichkeit</h1>
          <p className="text-[#dfc0b7] text-base mb-8 text-center">Wie soll eure Marke wirken?</p>
          <div className="flex flex-col gap-3 w-full">
            {opts.map((o) => (
              <FBRadio key={o} label={o} selected={data.tonalitaet === o} onSelect={() => set({ tonalitaet: o })} />
            ))}
          </div>
        </div>
      );
    }
    case "markenstärke":
      return (
        <div className="w-full max-w-lg flex flex-col items-center">
          <h1 className="font-heading text-4xl text-[#e2e2e9] mb-3 text-center tracking-wide">Markenstärke</h1>
          <p className="text-[#dfc0b7] text-base mb-8 text-center">
            Was macht eure Marke einzigartig? Was sagen eure treuesten Kunden über euch — und was unterscheidet euch von der Konkurrenz?
          </p>
          <FBTextarea
            value={data.markenstärke ?? ""}
            onChange={(v) => set({ markenstärke: v })}
            placeholder="z. B. Unsere Kunden schätzen die persönliche Betreuung. Im Gegensatz zur Konkurrenz..."
          />
        </div>
      );
    case "zusammenarbeit": {
      const opts = [
        { value: "fertiger-plan", label: "Fertiger Marketingplan", desc: "Einen fertigen Plan mit bereits ausgewählten Freelancern" },
        { value: "auswahl-3", label: "2–3 Freelancer vorgeschlagen", desc: "Je 2–3 Vorschläge aus verschiedenen Preisklassen" },
        { value: "alle", label: "Alle passenden Freelancer", desc: "Ich suche selbst nach Qualifikation und Preis aus" },
        { value: "weiss-nicht", label: "Ich weiss es noch nicht", desc: "" },
      ];
      return (
        <div className="w-full max-w-lg flex flex-col items-center">
          <h1 className="font-heading text-4xl text-[#e2e2e9] mb-3 text-center tracking-wide">Zusammenarbeit</h1>
          <p className="text-[#dfc0b7] text-base mb-8 text-center">Wie soll die Zusammenarbeit ablaufen?</p>
          <div className="flex flex-col gap-3 w-full">
            {opts.map((o) => (
              <FBRadio
                key={o.value}
                label={o.label}
                description={o.desc || undefined}
                selected={data.zusammenarbeit === o.value}
                onSelect={() => set({ zusammenarbeit: o.value, budget: undefined })}
              />
            ))}
          </div>
        </div>
      );
    }
    case "budget": {
      const opts = ["Unter CHF 1'000", "CHF 1'000–2'500", "CHF 2'500–5'000", "CHF 5'000–10'000", "Über CHF 10'000"];
      const isGrob = data.zusammenarbeit === "auswahl-3";
      return (
        <div className="w-full max-w-lg flex flex-col items-center">
          <h1 className="font-heading text-4xl text-[#e2e2e9] mb-3 text-center tracking-wide">Budget</h1>
          <p className="text-[#dfc0b7] text-base mb-8 text-center">
            {isGrob
              ? "Welches grobe Budget steht zur Verfügung? (Freelancer-Honorare)"
              : "Welches Gesamtbudget steht für die Umsetzung zur Verfügung? (Freelancer-Honorare, ohne Werbeausgaben)"}
          </p>
          <div className="flex flex-col gap-3 w-full">
            {opts.map((o) => (
              <FBRadio key={o} label={o} selected={data.budget === o} onSelect={() => set({ budget: o })} />
            ))}
          </div>
        </div>
      );
    }
    default:
      return null;
  }
}

export function StepFragebogenA({
  initial,
  onComplete,
  onBack,
}: {
  initial: Partial<FragebogenAData>;
  onComplete: (data: FragebogenAData) => void;
  onBack: () => void;
}) {
  const [data, setData] = useState<Partial<FragebogenAData>>(initial);
  const [qIdx, setQIdx] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.a) setData((d) => ({ ...parsed.a, ...d }));
      }
    } catch {}
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const obj = saved ? JSON.parse(saved) : {};
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...obj, a: data }));
    } catch {}
  }, [data]);

  const merge = (u: Partial<FragebogenAData>) => setData((d) => ({ ...d, ...u }));
  const seq = getSeqA(data);
  const currentKey = seq[qIdx];

  const goNext = () => {
    if (qIdx < seq.length - 1) {
      setQIdx((i) => i + 1);
    } else {
      onComplete(data as FragebogenAData);
    }
  };

  const goBack = () => {
    if (qIdx === 0) onBack();
    else setQIdx((i) => i - 1);
  };

  return (
    <div className="w-full flex flex-col items-center pb-40">
      <FBProgress current={qIdx + 1} total={seq.length} />
      {renderQA(currentKey, data, merge)}
      <FBNav
        onNext={goNext}
        onBack={goBack}
        disabled={!canProceedA(currentKey, data)}
        nextLabel={qIdx === seq.length - 1 ? "Analyse starten" : "Weiter"}
      />
    </div>
  );
}

// ─── Fragebogen B (Produkt) ───────────────────────────────────────────────────

type QKeyB =
  | "angebotstyp"
  | "produktstatus"
  | "marketingziel"
  | "zielgruppe-segment"
  | "zielgruppe-alter"
  | "zielgruppe-text"
  | "usp"
  | "preissegment"
  | "cicd-status"
  | "cicd-einhaltung"
  | "cicd-vorgaben"
  | "leistungen"
  | "zeitrahmen"
  | "zusammenarbeit"
  | "budget";

function getSeqB(data: Partial<FragebogenBData>): QKeyB[] {
  const seq: QKeyB[] = [
    "angebotstyp",
    "produktstatus",
    "marketingziel",
    "zielgruppe-segment",
    "zielgruppe-alter",
    "zielgruppe-text",
    "usp",
    "preissegment",
    "cicd-status",
  ];
  if (data.cicdStatus === "ja-vollständig" || data.cicdStatus === "teilweise") {
    seq.push("cicd-einhaltung", "cicd-vorgaben");
  }
  seq.push("leistungen", "zeitrahmen", "zusammenarbeit");
  if (data.zusammenarbeit === "fertiger-plan" || data.zusammenarbeit === "auswahl-3") {
    seq.push("budget");
  }
  return seq;
}

function canProceedB(key: QKeyB, data: Partial<FragebogenBData>): boolean {
  switch (key) {
    case "angebotstyp": return !!data.angebotstyp;
    case "produktstatus": return !!data.produktstatus;
    case "marketingziel": return !!data.marketingziel;
    case "zielgruppe-segment": return !!data.zielgruppeSegment;
    case "zielgruppe-alter": return (data.zielgruppeAlter?.length ?? 0) > 0;
    case "zielgruppe-text": return !!data.zielgruppeBeschreibung?.trim();
    case "usp": return !!data.usp?.trim();
    case "preissegment": return !!data.preissegment;
    case "cicd-status": return !!data.cicdStatus;
    case "cicd-einhaltung": return !!data.cicdEinhaltung;
    case "cicd-vorgaben": return true;
    case "leistungen": return (data.leistungen?.length ?? 0) > 0;
    case "zeitrahmen": return !!data.zeitrahmen;
    case "zusammenarbeit": return !!data.zusammenarbeit;
    case "budget": return !!data.budget;
    default: return true;
  }
}

function renderQB(
  key: QKeyB,
  data: Partial<FragebogenBData>,
  set: (u: Partial<FragebogenBData>) => void
): React.ReactNode {
  switch (key) {
    case "angebotstyp": {
      const opts = [
        "Physisches Produkt (z. B. Konsumgut, Gerät)",
        "Digitales Produkt (z. B. App, Software, Online-Kurs)",
        "Dienstleistung / Beratung",
        "Abonnement / Mitgliedschaft",
        "Handwerk / Reparatur / Installation",
        "Gastronomie / Catering",
      ];
      return (
        <div className="w-full max-w-lg flex flex-col items-center">
          <h1 className="font-heading text-4xl text-[#e2e2e9] mb-3 text-center tracking-wide">Was vermarktet ihr?</h1>
          <p className="text-[#dfc0b7] text-base mb-8 text-center">Was ist euer Angebot?</p>
          <div className="flex flex-col gap-3 w-full">
            {opts.map((o) => <FBRadio key={o} label={o} selected={data.angebotstyp === o} onSelect={() => set({ angebotstyp: o })} />)}
          </div>
        </div>
      );
    }
    case "produktstatus": {
      const opts = [
        { value: "neu", label: "Neu", desc: "Wir launchen es gerade erst" },
        { value: "wachstum", label: "Wachstum", desc: "Es läuft, wir wollen skalieren" },
        { value: "etabliert", label: "Etabliert", desc: "Wir wollen es verteidigen / weiterentwickeln" },
        { value: "relaunch", label: "Relaunch", desc: "Wir positionieren es neu" },
      ];
      return (
        <div className="w-full max-w-lg flex flex-col items-center">
          <h1 className="font-heading text-4xl text-[#e2e2e9] mb-3 text-center tracking-wide">Produktstatus</h1>
          <p className="text-[#dfc0b7] text-base mb-8 text-center">In welcher Phase befindet sich euer Produkt / eure Dienstleistung?</p>
          <div className="flex flex-col gap-3 w-full">
            {opts.map((o) => <FBRadio key={o.value} label={o.label} description={o.desc} selected={data.produktstatus === o.value} onSelect={() => set({ produktstatus: o.value })} />)}
          </div>
        </div>
      );
    }
    case "marketingziel": {
      const opts = [
        "Erstverkäufe / Erstabnehmer gewinnen (Launch)",
        "Mehr Anfragen & qualifizierte Leads generieren",
        "Online-Verkäufe / Conversions steigern",
        "Lokale Nachfrage ankurbeln (Laufkundschaft, Buchungen)",
        "Bestandskunden zu Wiederkauf animieren (Retention)",
        "Bestellvolumen / Durchschnittswert erhöhen (Upsell)",
        "App-Downloads / Nutzerregistrierungen steigern",
      ];
      return (
        <div className="w-full max-w-lg flex flex-col items-center">
          <h1 className="font-heading text-4xl text-[#e2e2e9] mb-3 text-center tracking-wide">Marketingziel</h1>
          <p className="text-[#dfc0b7] text-base mb-8 text-center">Was ist das wichtigste Ziel für dieses Produkt / diese Dienstleistung?</p>
          <div className="flex flex-col gap-3 w-full">
            {opts.map((o) => <FBRadio key={o} label={o} selected={data.marketingziel === o} onSelect={() => set({ marketingziel: o })} />)}
          </div>
        </div>
      );
    }
    case "zielgruppe-segment": {
      const opts = ["B2C (Privatkunden)", "B2B (Unternehmen)", "Beide"];
      return (
        <div className="w-full max-w-lg flex flex-col items-center">
          <h1 className="font-heading text-4xl text-[#e2e2e9] mb-3 text-center tracking-wide">Zielgruppe</h1>
          <p className="text-[#dfc0b7] text-base mb-8 text-center">Wer kauft euer Produkt oder bucht eure Dienstleistung?</p>
          <div className="flex flex-col gap-3 w-full">
            {opts.map((o) => <FBRadio key={o} label={o} selected={data.zielgruppeSegment === o} onSelect={() => set({ zielgruppeSegment: o })} />)}
          </div>
        </div>
      );
    }
    case "zielgruppe-alter": {
      const opts = ["Unter 18", "18–25 (Gen-Z)", "26–35 (Millennials)", "36–50", "50+"];
      const toggle = (v: string) => {
        const cur = data.zielgruppeAlter ?? [];
        set({ zielgruppeAlter: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] });
      };
      return (
        <div className="w-full max-w-lg flex flex-col items-center">
          <h1 className="font-heading text-4xl text-[#e2e2e9] mb-3 text-center tracking-wide">Altersgruppe</h1>
          <p className="text-[#dfc0b7] text-base mb-8 text-center">Welche Altersgruppe ist eure Hauptzielgruppe? (Mehrfachauswahl möglich)</p>
          <div className="flex flex-wrap gap-3 justify-center w-full">
            {opts.map((o) => <FBTag key={o} label={o} active={(data.zielgruppeAlter ?? []).includes(o)} onToggle={() => toggle(o)} />)}
          </div>
        </div>
      );
    }
    case "zielgruppe-text":
      return (
        <div className="w-full max-w-lg flex flex-col items-center">
          <h1 className="font-heading text-4xl text-[#e2e2e9] mb-3 text-center tracking-wide">Typischer Käufer</h1>
          <p className="text-[#dfc0b7] text-base mb-8 text-center">
            Was ist sein/ihr Problem, das euer Produkt löst? Was hat bisher gezögert ihn/sie zu kaufen? Was überzeugt ihn/sie am Ende?
          </p>
          <FBTextarea
            value={data.zielgruppeBeschreibung ?? ""}
            onChange={(v) => set({ zielgruppeBeschreibung: v })}
            placeholder="z. B. Selbständige zwischen 30–45, die zu wenig Zeit für Marketing haben. Sie zögern wegen des Preises, überzeugt werden sie durch..."
          />
        </div>
      );
    case "usp":
      return (
        <div className="w-full max-w-lg flex flex-col items-center">
          <h1 className="font-heading text-4xl text-[#e2e2e9] mb-3 text-center tracking-wide">USP & Vorteile</h1>
          <p className="text-[#dfc0b7] text-base mb-8 text-center">
            Was ist der grösste Vorteil eures Produkts / eurer Dienstleistung gegenüber Alternativen? Nennt konkrete Fakten (Preis, Qualität, Geschwindigkeit, Exklusivität).
          </p>
          <FBTextarea
            value={data.usp ?? ""}
            onChange={(v) => set({ usp: v })}
            placeholder="z. B. 3x schnellere Lieferung als Mitbewerber, lokal produziert, 2 Jahre Garantie..."
          />
        </div>
      );
    case "preissegment": {
      const opts = [
        { value: "günstig", label: "Günstig", desc: "Preisführerschaft, attraktiv für Budgetbewusste" },
        { value: "mittelklasse", label: "Mittelklasse", desc: "Solides Preis-Leistungs-Verhältnis" },
        { value: "premium", label: "Premium", desc: "Höherer Preis, klar differenzierter Mehrwert" },
        { value: "luxus", label: "Luxus", desc: "Exclusivität und Prestige im Vordergrund" },
      ];
      return (
        <div className="w-full max-w-lg flex flex-col items-center">
          <h1 className="font-heading text-4xl text-[#e2e2e9] mb-3 text-center tracking-wide">Preissegment</h1>
          <p className="text-[#dfc0b7] text-base mb-8 text-center">Wie ist euer Angebot preislich positioniert?</p>
          <div className="flex flex-col gap-3 w-full">
            {opts.map((o) => <FBRadio key={o.value} label={o.label} description={o.desc} selected={data.preissegment === o.value} onSelect={() => set({ preissegment: o.value })} />)}
          </div>
        </div>
      );
    }
    case "cicd-status": {
      const opts = [
        { value: "ja-vollständig", label: "Ja, vollständig", desc: "Logo, Farben, Schriften, Guidelines vorhanden" },
        { value: "teilweise", label: "Teilweise", desc: "Logo da, aber keine konsistenten Vorgaben" },
        { value: "kaum", label: "Kaum", desc: "Ein Logo, mehr nicht" },
        { value: "nein-neu", label: "Nein – neues Design entwickeln", desc: "" },
      ];
      return (
        <div className="w-full max-w-lg flex flex-col items-center">
          <h1 className="font-heading text-4xl text-[#e2e2e9] mb-3 text-center tracking-wide">Corporate Design</h1>
          <p className="text-[#dfc0b7] text-base mb-8 text-center">Habt ihr bereits ein Corporate Design für dieses Produkt?</p>
          <div className="flex flex-col gap-3 w-full">
            {opts.map((o) => (
              <FBRadio
                key={o.value}
                label={o.label}
                description={o.desc || undefined}
                selected={data.cicdStatus === o.value}
                onSelect={() => set({ cicdStatus: o.value, cicdEinhaltung: undefined, cicdVorgaben: undefined })}
              />
            ))}
          </div>
        </div>
      );
    }
    case "cicd-einhaltung": {
      const opts = [
        { value: "strikt", label: "Strikt", desc: "Exakt nach unseren Vorgaben" },
        { value: "flexibel", label: "Flexibel", desc: "Basis behalten, Rest darf weiterentwickelt werden" },
        { value: "offen", label: "Offen", desc: "Verbesserungsvorschläge willkommen" },
      ];
      return (
        <div className="w-full max-w-lg flex flex-col items-center">
          <h1 className="font-heading text-4xl text-[#e2e2e9] mb-3 text-center tracking-wide">Design Einhaltung</h1>
          <p className="text-[#dfc0b7] text-base mb-8 text-center">Wie stark soll das bestehende Design eingehalten werden?</p>
          <div className="flex flex-col gap-3 w-full">
            {opts.map((o) => <FBRadio key={o.value} label={o.label} description={o.desc} selected={data.cicdEinhaltung === o.value} onSelect={() => set({ cicdEinhaltung: o.value })} />)}
          </div>
        </div>
      );
    }
    case "cicd-vorgaben":
      return (
        <div className="w-full max-w-lg flex flex-col items-center">
          <h1 className="font-heading text-4xl text-[#e2e2e9] mb-3 text-center tracking-wide">Design Vorgaben</h1>
          <p className="text-[#dfc0b7] text-base mb-2 text-center">Spezifische Vorgaben, Farben, Schriften oder Dos & Don'ts?</p>
          <p className="text-[#4A4D55] text-sm mb-8 text-center">(Optional – Datei-Upload folgt)</p>
          <FBTextarea
            value={data.cicdVorgaben ?? ""}
            onChange={(v) => set({ cicdVorgaben: v })}
            placeholder="z. B. Hauptfarbe #D95D39, Schrift: Inter, kein Comic Sans..."
            rows={5}
          />
        </div>
      );
    case "leistungen": {
      const opts = [
        "Social Media Content", "Grafikdesign", "Foto & Video", "Copywriting",
        "SEO & Blogartikel", "Google Ads", "Meta Ads", "E-Mail-Kampagne",
        "Landing Page", "Print-Design", "Übersetzungen", "Strategie & Beratung", "Retail Media",
      ];
      const toggle = (v: string) => {
        const cur = data.leistungen ?? [];
        set({ leistungen: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] });
      };
      return (
        <div className="w-full max-w-lg flex flex-col items-center">
          <h1 className="font-heading text-4xl text-[#e2e2e9] mb-3 text-center tracking-wide">Gewünschte Leistungen</h1>
          <p className="text-[#dfc0b7] text-base mb-8 text-center">Was soll konkret produziert werden? (Mehrfachauswahl möglich)</p>
          <div className="flex flex-wrap gap-3 justify-center w-full">
            {opts.map((o) => <FBTag key={o} label={o} active={(data.leistungen ?? []).includes(o)} onToggle={() => toggle(o)} />)}
          </div>
        </div>
      );
    }
    case "zeitrahmen": {
      const opts = [
        { value: "sofort", label: "So schnell wie möglich", desc: "Innerhalb 1–2 Wochen" },
        { value: "monat", label: "In ca. 1 Monat", desc: "" },
        { value: "zweidrei", label: "In 2–3 Monaten", desc: "" },
        { value: "laufend", label: "Laufendes Mandat", desc: "Kein fixer Start" },
      ];
      return (
        <div className="w-full max-w-lg flex flex-col items-center">
          <h1 className="font-heading text-4xl text-[#e2e2e9] mb-3 text-center tracking-wide">Zeitrahmen</h1>
          <p className="text-[#dfc0b7] text-base mb-8 text-center">Wann soll das Marketing starten?</p>
          <div className="flex flex-col gap-3 w-full">
            {opts.map((o) => <FBRadio key={o.value} label={o.label} description={o.desc || undefined} selected={data.zeitrahmen === o.value} onSelect={() => set({ zeitrahmen: o.value })} />)}
          </div>
        </div>
      );
    }
    case "zusammenarbeit": {
      const opts = [
        { value: "fertiger-plan", label: "Fertiger Marketingplan", desc: "Einen fertigen Plan mit bereits ausgewählten Freelancern" },
        { value: "auswahl-3", label: "2–3 Freelancer vorgeschlagen", desc: "Ich wähle danach selbst aus" },
        { value: "alle", label: "Alle passenden Freelancer", desc: "Ich suche nach Qualifikation und Preis aus" },
        { value: "weiss-nicht", label: "Ich weiss es noch nicht", desc: "" },
      ];
      return (
        <div className="w-full max-w-lg flex flex-col items-center">
          <h1 className="font-heading text-4xl text-[#e2e2e9] mb-3 text-center tracking-wide">Zusammenarbeit</h1>
          <p className="text-[#dfc0b7] text-base mb-8 text-center">Wie soll die Zusammenarbeit ablaufen?</p>
          <div className="flex flex-col gap-3 w-full">
            {opts.map((o) => (
              <FBRadio
                key={o.value}
                label={o.label}
                description={o.desc || undefined}
                selected={data.zusammenarbeit === o.value}
                onSelect={() => set({ zusammenarbeit: o.value, budget: undefined })}
              />
            ))}
          </div>
        </div>
      );
    }
    case "budget": {
      const opts = ["Unter CHF 1'000", "CHF 1'000–2'500", "CHF 2'500–5'000", "CHF 5'000–10'000", "Über CHF 10'000"];
      const isGrob = data.zusammenarbeit === "auswahl-3";
      return (
        <div className="w-full max-w-lg flex flex-col items-center">
          <h1 className="font-heading text-4xl text-[#e2e2e9] mb-3 text-center tracking-wide">Budget</h1>
          <p className="text-[#dfc0b7] text-base mb-8 text-center">
            {isGrob ? "Welches grobe Budget habt ihr für die Freelancer-Honorare?" : "Welches Gesamtbudget habt ihr für die Freelancer-Honorare?"}
          </p>
          <div className="flex flex-col gap-3 w-full">
            {opts.map((o) => <FBRadio key={o} label={o} selected={data.budget === o} onSelect={() => set({ budget: o })} />)}
          </div>
        </div>
      );
    }
    default:
      return null;
  }
}

export function StepFragebogenB({
  initial,
  onComplete,
  onBack,
}: {
  initial: Partial<FragebogenBData>;
  onComplete: (data: FragebogenBData) => void;
  onBack: () => void;
}) {
  const [data, setData] = useState<Partial<FragebogenBData>>(initial);
  const [qIdx, setQIdx] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.b) setData((d) => ({ ...parsed.b, ...d }));
      }
    } catch {}
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const obj = saved ? JSON.parse(saved) : {};
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...obj, b: data }));
    } catch {}
  }, [data]);

  const merge = (u: Partial<FragebogenBData>) => setData((d) => ({ ...d, ...u }));
  const seq = getSeqB(data);
  const currentKey = seq[qIdx];

  const goNext = () => {
    if (qIdx < seq.length - 1) setQIdx((i) => i + 1);
    else onComplete(data as FragebogenBData);
  };

  const goBack = () => {
    if (qIdx === 0) onBack();
    else setQIdx((i) => i - 1);
  };

  return (
    <div className="w-full flex flex-col items-center pb-40">
      <FBProgress current={qIdx + 1} total={seq.length} />
      {renderQB(currentKey, data, merge)}
      <FBNav
        onNext={goNext}
        onBack={goBack}
        disabled={!canProceedB(currentKey, data)}
        nextLabel={qIdx === seq.length - 1 ? "Analyse starten" : "Weiter"}
      />
    </div>
  );
}

// ─── Fragebogen Typ Selector ──────────────────────────────────────────────────

export function StepFragebogenTyp({
  onSelect,
  onBack,
}: {
  onSelect: (typ: FragebogenTyp) => void;
  onBack: () => void;
}) {
  const [selected, setSelected] = useState<FragebogenTyp | null>(null);

  const opts: { value: FragebogenTyp; icon: string; title: string; desc: string }[] = [
    {
      value: "marke",
      icon: "brand_awareness",
      title: "Marke / Brand Marketing",
      desc: "Markenbekanntheit aufbauen, Image stärken, Zielgruppen ansprechen — langfristig und strategisch.",
    },
    {
      value: "produkt",
      icon: "shopping_bag",
      title: "Produkt / Dienstleistung",
      desc: "Verkäufe steigern, Leads generieren, Conversions maximieren — konkret und messbar.",
    },
  ];

  return (
    <div className="w-full max-w-2xl flex flex-col items-center">
      <h1 className="font-heading text-5xl text-[#e2e2e9] mb-4 text-center tracking-wide">Was möchtet ihr vermarkten?</h1>
      <p className="text-[#dfc0b7] text-base mb-12 text-center">
        Wählt den passenden Fragebogen — je nach Fokus erhaltet ihr präzisere Empfehlungen.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-8">
        {opts.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setSelected(opt.value)}
            className={`bg-[#1A1D24] border-2 rounded-xl p-8 text-left flex flex-col gap-5 transition-all duration-200 focus:outline-none ${
              selected === opt.value ? "border-[#D95D39]" : "border-[#2D3139] hover:border-[#D95D39]/50"
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
            selected ? "bg-[#D95D39] text-white hover:bg-[#c44e2e]" : "bg-[#2D3139] text-[#7A7D85] cursor-not-allowed"
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

// ─── Synthesis helper (browser data → AI description) ────────────────────────

export function synthesizeBeschreibung(
  typ: FragebogenTyp,
  a?: FragebogenAData | null,
  b?: FragebogenBData | null
): string {
  if (typ === "marke" && a) {
    const parts: string[] = [];
    if (a.unternehmenstyp) parts.push(a.unternehmenstyp);
    if (a.markenziel) parts.push(a.markenziel.toLowerCase());
    if (a.zielgruppeSegment?.length) parts.push(`Zielgruppe: ${a.zielgruppeSegment.join(", ")}`);
    return parts.join(" · ");
  }
  if (typ === "produkt" && b) {
    const parts: string[] = [];
    if (b.angebotstyp) parts.push(b.angebotstyp);
    if (b.marketingziel) parts.push(b.marketingziel.toLowerCase());
    return parts.join(" · ");
  }
  return "";
}
