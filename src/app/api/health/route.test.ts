import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const URL_OK = "https://example.supabase.co";
const KEY_OK = "sb_publishable_test";

describe("GET /api/health", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", URL_OK);
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", KEY_OK);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("meldet status ok, wenn Supabase erreichbar ist", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200 }));

    const { GET } = await import("./route");
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe("ok");
    expect(body.supabase).toBe(true);
    expect(typeof body.timestamp).toBe("string");
  });

  it("sendet den Publishable Key als apikey-Header", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal("fetch", fetchMock);

    const { GET } = await import("./route");
    await GET();

    const [calledUrl, options] = fetchMock.mock.calls[0];
    expect(calledUrl).toBe(`${URL_OK}/auth/v1/health`);
    expect(options.headers.apikey).toBe(KEY_OK);
  });

  it("meldet http_401, wenn der Key abgelehnt wird", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 401 }));

    const { GET } = await import("./route");
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body.reason).toBe("http_401");
  });

  it("meldet unreachable, wenn der Fetch fehlschlaegt", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fetch failed")));

    const { GET } = await import("./route");
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body.reason).toBe("unreachable");
  });

  it("meldet env_missing, wenn Variablen fehlen", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");

    const { GET } = await import("./route");
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body.reason).toBe("env_missing");
  });
});