import { beforeEach, describe, expect, it, vi } from "vitest";

const { createBrowserClient } = vi.hoisted(() => ({
  createBrowserClient: vi.fn(() => ({ mocked: "browser-client" })),
}));

vi.mock("@supabase/ssr", () => ({ createBrowserClient }));

describe("createClient (Supabase Browser Client)", () => {
  beforeEach(() => {
    vi.resetModules();
    createBrowserClient.mockClear();
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "test-anon-key");
  });

  it("instanziiert den Browser-Client mit URL und Anon-Key aus den Env-Variablen", async () => {
    const { createClient } = await import("./client");

    const client = createClient();

    expect(createBrowserClient).toHaveBeenCalledWith(
      "https://example.supabase.co",
      "test-anon-key",
    );
    expect(client).toEqual({ mocked: "browser-client" });
  });
});
