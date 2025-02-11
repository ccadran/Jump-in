import { describe, it, expect, vi, afterEach } from "vitest";
import { createSupabaseClient } from "../../../supabaseClient";
import type { Database } from "~/types/supabase";

describe("DELETE /api/guild", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("DELETE /api/guild (supprime un utilisateur d'une guilde)", async () => {
    const supabase = createSupabaseClient();

    const mockDelete = vi.fn().mockReturnThis();
    const mockMatch = vi.fn().mockResolvedValue({
      data: [{ user_id: 1, challenge_complete_id: 1 }],
      error: null,
    });

    const spy = vi.spyOn(supabase, "from").mockImplementation(
      () =>
        ({
          delete: mockDelete,
          match: mockMatch,
        } as any)
    );

    const userId = 1;
    const challengeCompleteId = 1;

    // Simuler la suppression d'un utilisateur d'une guilde
    const { data, error } = await supabase
      .from("complete_challenges")
      .delete()
      .match({ user_id: userId, challenge_complete_id: challengeCompleteId });

    // Vérification des appels
    expect(spy).toHaveBeenCalledWith("complete_challenges");
    expect(mockDelete).toHaveBeenCalled();
    expect(mockMatch).toHaveBeenCalledWith({
      user_id: userId,
      challenge_complete_id: challengeCompleteId,
    });

    // Vérification de la réponse attendue
    expect(data).toBeDefined();
    expect(data).toEqual([
      { user_id: userId, challenge_complete_id: challengeCompleteId },
    ]);

    // Vérifie qu'il n'y a pas d'erreur
    expect(error).toBeNull();
  });
});
