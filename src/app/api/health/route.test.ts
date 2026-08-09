import { beforeEach, describe, expect, it, vi } from "vitest";
import { createClient } from "@/lib/supabase/server";
import { GET } from "./route";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

describe("GET /api/health", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("meldet status ok, wenn die Supabase-Verbindung funktioniert", async () => {
    vi.mocked(createClient).mockResolvedValue({
      auth: { getSession: vi.fn().mockResolvedValue({ error: null }) },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const response = await GET();
    const body = await response.json();

    expect(body).toEqual({ status: "ok", supabase: true });
  });

  it("meldet status error, wenn Supabase einen Fehler zurueckgibt", async () => {
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getSession: vi.fn().mockResolvedValue({ error: new Error("nicht erreichbar") }),
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const response = await GET();
    const body = await response.json();

    expect(body).toEqual({ status: "error", supabase: false });
  });

  it("meldet status error, wenn der Supabase-Client nicht erstellt werden kann", async () => {
    vi.mocked(createClient).mockRejectedValue(new Error("fehlende Env-Variablen"));

    const response = await GET();
    const body = await response.json();

    expect(body).toEqual({ status: "error", supabase: false });
  });
});
