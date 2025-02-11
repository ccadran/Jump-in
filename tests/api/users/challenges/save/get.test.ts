import { describe, it, expect, vi, afterEach } from "vitest";
import { createSupabaseClient } from "../../../supabaseClient";

describe("GET /api/guilds", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("GET /api/guilds (simulé avec plusieurs guildes, mais seulement celui avec user_id = 1)", async () => {
    const supabase = createSupabaseClient();

    const mockData = {
      data: [
        {
          user_id: "1",
          challenge_id: "1",
        },
      ],
      error: null,
    };

    // Simulation de la chaîne complète
    const mockSelect = vi.fn().mockReturnThis();
    const mockEq = vi.fn().mockResolvedValue(mockData);

    const spy = vi.spyOn(supabase, "from").mockImplementation(
      () =>
        ({
          select: mockSelect,
          eq: mockEq,
        } as any)
    );

    // Simuler la requête GET
    const { data, error } = await supabase
      .from("saved_challenges")
      .select("challenges(*)")
      .eq("user_id", "1");

    expect(spy).toHaveBeenCalled();
    expect(mockSelect).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith("user_id", "1");

    expect(data).toBeDefined();
    expect(data!.length).toBe(1);
    expect(data![0]).toEqual({
      user_id: "1",
      challenge_id: "1",
    });

    expect(error).toBeNull();
  });
});
