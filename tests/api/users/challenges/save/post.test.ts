import { describe, it, expect, vi, afterEach } from "vitest";
import { createSupabaseClient } from "../../../supabaseClient";

describe("POST /api/users/challenges/save", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("ajouter un challenge aux challenges sauvegardés", async () => {
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

    const { data, error } = await supabase.from("saved_challenges").insert({
      user_id: "1",
      guild_id: "1",
    });

    expect(spy).toHaveBeenCalled();
    expect(data).toBeDefined();
    expect(error).toBeNull();
  });
});
