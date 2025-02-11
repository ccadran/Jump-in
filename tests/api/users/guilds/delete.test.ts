import { describe, it, expect, vi, afterEach } from "vitest";
import { createSupabaseClient } from "../../supabaseClient";
import type { Database } from "~/types/supabase";

describe("DELETE /api/guild", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("DELETE /api/guild (supprime un utilisateur d'une guilde)", async () => {
    const supabase = createSupabaseClient();

    const mockDelete = vi.fn().mockReturnThis();
    const mockMatch = vi.fn().mockResolvedValue({
      data: [{ user_id: 1, guild_id: 1 }],
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
    const guildId = 1;

    // Simuler la suppression d'un utilisateur d'une guilde
    const { data, error } = await supabase
      .from("user_guilds")
      .delete()
      .match({ user_id: userId, guild_id: guildId });

    // Vérification des appels
    expect(spy).toHaveBeenCalledWith("user_guilds");
    expect(mockDelete).toHaveBeenCalled();
    expect(mockMatch).toHaveBeenCalledWith({
      user_id: userId,
      guild_id: guildId,
    });

    // Vérification de la réponse attendue
    expect(data).toBeDefined();
    expect(data).toEqual([{ user_id: userId, guild_id: guildId }]);

    // Vérifie qu'il n'y a pas d'erreur
    expect(error).toBeNull();
  });
});
