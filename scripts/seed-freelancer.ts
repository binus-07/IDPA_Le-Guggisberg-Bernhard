#!/usr/bin/env tsx
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

// Load .env.local
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const m = line.match(/^([^#=\s][^=]*)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Fehler: NEXT_PUBLIC_SUPABASE_URL oder SUPABASE_SERVICE_ROLE_KEY fehlt in .env.local",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const DATA_DIR = path.join(process.cwd(), "data");

// Robust CSV parser: handles BOM, semicolon delimiter, quoted fields
function parseCSV(filePath: string): Record<string, string>[] {
  const content = fs.readFileSync(filePath, "utf-8").replace(/^\uFEFF/, "");
  const lines = content.split(/\r?\n/);

  function parseLine(line: string): string[] {
    const cols: string[] = [];
    let field = "";
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQ && line[i + 1] === '"') {
          field += '"';
          i++;
        } else inQ = !inQ;
      } else if (ch === ";" && !inQ) {
        cols.push(field);
        field = "";
      } else {
        field += ch;
      }
    }
    cols.push(field);
    return cols;
  }

  const headers = parseLine(lines[0]).map((h) => h.trim());
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const vals = parseLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = (vals[idx] ?? "").trim();
    });
    rows.push(row);
  }
  return rows;
}

// ─── Seed functions ───────────────────────────────────────────────────────────

async function seedFreelancer() {
  const rows = parseCSV(path.join(DATA_DIR, "Freelancer_Datenbank_Freelancer.csv"));
  const data = rows
    .filter((r) => r["Freelancer-ID"])
    .map((r) => ({
      freelancer_id: r["Freelancer-ID"],
      nachname: r["Nachname"] || null,
      vorname: r["Vorname"] || null,
      rolle: r["Freelancer-Tätigkeit"] || null,
      jahre_taetig: r["Jahre tätig"] ? parseInt(r["Jahre tätig"]) : null,
      bezahlung_chf: r["Ø Bezahlung pro Projekt (CHF)"]
        ? parseFloat(r["Ø Bezahlung pro Projekt (CHF)"])
        : null,
      kurzbeschreibung: r["Kurzbeschreibung"] || null,
      bio: r["Ausführliche Beschreibung"] || null,
      profile_image_url: r["Profilfoto (URL)"] || null,
    }));

  const { error } = await supabase.from("freelancer").upsert(data, { onConflict: "freelancer_id" });
  if (error) throw new Error(`freelancer: ${error.message}`);
  console.log(`  ✓ ${data.length} Freelancer`);
}

async function seedProjekte() {
  await supabase.from("freelancer_projekte").delete().neq("id", 0);

  const rows = parseCSV(path.join(DATA_DIR, "Freelancer_Datenbank_Projekte.csv"));
  const data = rows
    .filter((r) => r["Freelancer-ID"])
    .map((r) => ({
      freelancer_id: r["Freelancer-ID"],
      titel: r["Titel"] || null,
      bewertung: r["Bewertung (1-5)"] ? parseFloat(r["Bewertung (1-5)"]) : null,
      beschreibung: r["Beschreibung"] || null,
    }));

  const { error } = await supabase.from("freelancer_projekte").insert(data);
  if (error) throw new Error(`freelancer_projekte: ${error.message}`);
  console.log(`  ✓ ${data.length} Projekte`);
}

async function seedMarketing() {
  await supabase.from("marketing_aktivitaeten").delete().neq("id", 0);

  const rows = parseCSV(path.join(DATA_DIR, "Freelancer_Marketing_Aktivitaeten_Übersicht.csv"));
  const data = rows
    .filter((r) => r["Freelancer-Rolle"] && r["Marketing-Aktivität"])
    .map((r) => ({
      rolle: r["Freelancer-Rolle"],
      kategorie: r["Kategorie"] || null,
      aktivitaet: r["Marketing-Aktivität"],
      beschreibung: r["Beschreibung / Nutzen"] || null,
    }));

  const { error } = await supabase.from("marketing_aktivitaeten").insert(data);
  if (error) throw new Error(`marketing_aktivitaeten: ${error.message}`);
  console.log(`  ✓ ${data.length} Marketing-Aktivitäten`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("Seeding Supabase...\n");
  try {
    await seedFreelancer();
    await seedProjekte();
    await seedMarketing();
    console.log("\n✅ Fertig!");
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("\n❌", msg);
    if (msg.includes("relation") || msg.includes("does not exist")) {
      console.error(
        "\nTabellen fehlen. Führe zuerst die Migration aus:\n" +
          "→ Supabase Dashboard → SQL Editor\n" +
          "→ Inhalt von: supabase/migrations/20260820130000_freelancer_und_marketing.sql\n" +
          "→ Dann nochmal: npm run seed",
      );
    }
    process.exit(1);
  }
}

main();
