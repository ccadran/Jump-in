import { describe, it, expect, vi, afterEach } from "vitest";
import { createSupabaseClient } from "../../../supabaseClient";

describe("POST /api/users/challenges/complete", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("ajouter un challenge compléter associé à un user", async () => {
    const supabase = createSupabaseClient();

    const spy = vi.spyOn(supabase, "from").mockImplementation(
      () =>
        ({
          insert: vi.fn().mockResolvedValue({
            data: [
              {
                title: "challenge complete",
                cover: "cover.jpg",
                description: "Description Test",
                challenge_id: "1",
                user_: "1",
              },
            ],
            error: null,
          }),
          select: vi.fn(),
        } as any)
    );

    const { data, error } = await supabase.from("complete_challenges").insert({
      title: "challenge complete",
      cover: "cover.jpg",
      description: "Description Test",
      challenge_id: "1",
      user_id: "1",
    });

    expect(spy).toHaveBeenCalled();
    expect(data).toBeDefined();
    expect(error).toBeNull();
  });
});
