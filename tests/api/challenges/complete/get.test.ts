import { describe, it, expect, vi, afterEach } from "vitest";
import { createSupabaseClient } from "../../supabaseClient";

describe("GET /api/challenges/complete", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("séléctionner les challenges complete d'un challenge ", async () => {
    const supabase = createSupabaseClient();

    const mockData = {
      data: [
        {
          challenge_id: "1",
          id: 1,
          name: "Challenge 1",
          cover: "cover1.jpg",
          description: "Description 1",
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
      .from("complete_challenges")
      .select("*")
      .eq("challenge_id", "1");

    expect(spy).toHaveBeenCalled();
    expect(mockSelect).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith("challenge_id", "1");

    expect(data).toBeDefined();
    expect(data!.length).toBe(1);
    expect(data![0]).toEqual({
      challenge_id: "1",
      id: 1,
      name: "Challenge 1",
      cover: "cover1.jpg",
      description: "Description 1",
    });

    expect(error).toBeNull();
  });
});
