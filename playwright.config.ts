import { execSync } from "node:child_process";
import { defineConfig, devices } from "@playwright/test";

interface LocalSupabaseStatus {
  API_URL: string;
  PUBLISHABLE_KEY: string;
}

function getLocalSupabaseCredentials(): LocalSupabaseStatus {
  try {
    const raw = execSync("npx supabase status -o json", { encoding: "utf-8" });
    return JSON.parse(raw) as LocalSupabaseStatus;
  } catch {
    throw new Error(
      "Lokale Supabase-Instanz nicht erreichbar. Vor den E2E-Tests einmal `npx supabase start` " +
        "ausfuehren (siehe README, Abschnitt 'E2E-Tests'). Die Tests laufen bewusst gegen die " +
        "lokale Instanz, nicht gegen das echte Supabase-Projekt.",
    );
  }
}

const { API_URL, PUBLISHABLE_KEY } = getLocalSupabaseCredentials();

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  // Next.js' Dev-Server kompiliert Routen beim ersten Aufruf on-demand (Turbopack), was pro
  // Route ohne Weiteres 1-2s dauern kann -- das Playwright-Default von 5s pro Assertion ist
  // dafuer knapp bemessen, besonders wenn Docker (lokale Supabase-Instanz) parallel laeuft.
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    env: {
      ...process.env,
      NEXT_PUBLIC_SUPABASE_URL: API_URL,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: PUBLISHABLE_KEY,
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
