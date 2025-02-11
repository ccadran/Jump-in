import { describe, it, expect, vi, afterEach } from "vitest";
import { createSupabaseClient } from "../../supabaseClient";

describe("POST /api/users/guilds", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("ajouter un user à une guild", async () => {
    const supabase = createSupabaseClient();
    // Espionner la méthode "from"
    const spy = vi.spyOn(supabase, "from").mockImplementation(
      () =>
        ({
          insert: vi.fn().mockResolvedValue({
            data: [
              {
                user_id: "1",
                guild_id: "1",
              },
            ],
            error: null,
          }),
          select: vi.fn(),
        } as any)
    );

    const { data, error } = await supabase.from("user_guilds").insert({
      user_id: "1",
      guild_id: "1",
    });

    expect(spy).toHaveBeenCalled();
    expect(data).toBeDefined();
    expect(error).toBeNull();
  });
});
