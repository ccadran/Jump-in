import { describe, it, expect, vi, afterEach } from "vitest";

import { createSupabaseClient } from "../supabaseClient";

describe("GET /api/challenges", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("récupère les challenges des guilds de l'utilisateur", async () => {
    const userId = "user123"; // Définition en dur du user_id
    const supabase = createSupabaseClient();
    const mockGuildsData = {
      data: [{ guild_id: "123" }, { guild_id: "456" }],
      error: null,
    };

    const mockChallengesData = {
      data: [
        {
          id: 1,
          name: "Challenge 1",
          guild: "123",
          created_at: "2024-02-01T00:00:00Z",
        },
      ],
      error: null,
    };

    // Simulation de la chaîne complète
    const mockSelect = vi.fn().mockReturnThis();
    const mockEq = vi
      .fn()
      .mockResolvedValueOnce(mockGuildsData)
      .mockReturnThis();
    const mockIn = vi.fn().mockReturnThis();
    const mockOrder = vi.fn().mockReturnThis();
    const mockLimit = vi.fn().mockResolvedValueOnce(mockChallengesData);

    // Espionner l'appel à `serverSupabaseClient`

    const spy = vi.spyOn(supabase, "from").mockImplementation(
      () =>
        ({
          select: mockSelect,
          eq: mockEq,
          in: mockIn,
          order: mockOrder,
          limit: mockLimit,
        } as any)
    );

    const { data: guilds, error: guildsError } = await supabase
      .from("user_guilds")
      .select("guild_id")
      .eq("user_id", userId);

    expect(spy).toHaveBeenCalled();
    expect(supabase.from).toHaveBeenCalledWith("user_guilds");
    expect(mockSelect).toHaveBeenCalledWith("guild_id");
    expect(mockEq).toHaveBeenCalledWith("user_id", userId);

    if (guildsError) throw new Error(guildsError.message);

    const guildIds = guilds.map((guild) => guild.guild_id);

    // Simuler la récupération des challenges
    const { data: challenges, error } = await supabase
      .from("challenges")
      .select("*")
      .in("guild", guildIds)
      .order("created_at", { ascending: false })
      .limit(10);

    expect(supabase.from).toHaveBeenCalledWith("challenges");
    expect(mockSelect).toHaveBeenCalledWith("*");
    expect(mockIn).toHaveBeenCalledWith("guild", ["123", "456"]);
    expect(mockOrder).toHaveBeenCalledWith("created_at", { ascending: false });
    expect(mockLimit).toHaveBeenCalledWith(10);

    expect(challenges).toBeDefined();
    expect(challenges!.length).toBe(1);
    expect(challenges![0]).toEqual({
      id: 1,
      name: "Challenge 1",
      guild: "123",
      created_at: "2024-02-01T00:00:00Z",
    });

    expect(error).toBeNull();
  });
});
