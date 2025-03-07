import { describe, it, expect, vi, afterEach } from "vitest";
import { createSupabaseClient } from "../supabaseClient";

describe("GET /api/challenges", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("récupérer les challenges", async () => {
    const supabase = createSupabaseClient();

    // Simulation de la réponse de Supabase pour la récupération des challenges
    const spy = vi.spyOn(supabase, "from").mockImplementation(
      () =>
        ({
          select: vi.fn().mockResolvedValue({
            data: [
              {
                id: "1",
                name: "Challenge 1",
                cover: "cover1.jpg",
                description: "Description 1",
              },
              {
                id: "2",
                name: "Challenge 2",
                cover: "cover2.jpg",
                description: "Description 2",
              },
              {
                id: "3",
                name: "Challenge 3",
                cover: "cover3.jpg",
                description: "Description 3",
              },
            ],
            error: null,
          }),
        } as any)
    );

    // Simuler la requête GET pour récupérer toutes les challenges
    const { data, error } = await supabase.from("challenges").select("*");

    expect(spy).toHaveBeenCalled();

    expect(spy.mock.results[0].value.select).toHaveBeenCalled();

    expect(data).toBeDefined();
    expect(data!.length).toBe(3);
    expect(data![0]).toEqual({
      id: "1",
      name: "Challenge 1",
      cover: "cover1.jpg",
      description: "Description 1",
    });
    expect(data![1]).toEqual({
      id: "2",
      name: "Challenge 2",
      cover: "cover2.jpg",
      description: "Description 2",
    });
    expect(data![2]).toEqual({
      id: "3",
      name: "Challenge 3",
      cover: "cover3.jpg",
      description: "Description 3",
    });

    // Vérifie qu'il n'y a pas d'erreur
    expect(error).toBeNull();
  });
});
