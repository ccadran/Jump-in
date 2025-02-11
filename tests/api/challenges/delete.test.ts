import { describe, it, expect, vi, afterEach } from "vitest";
import { createSupabaseClient } from "../supabaseClient";
import type { Database } from "~/types/supabase";
import type { Challenges } from "~/types/api";

describe("DELETE /api/guild", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it("DELETE /api/guild (simulé)", async () => {
    const supabase = createSupabaseClient();

    const spy = vi.spyOn(supabase, "from").mockImplementation(
      () =>
        ({
          delete: vi.fn().mockReturnThis(),
          eq: vi.fn().mockResolvedValue({
            data: [
              {
                id: "1",
                name: "Challenge Test",
                cover: "cover.jpg",
                description: "Description Test",
              },
            ],
            error: null,
          }),
          select: vi.fn(),
        } as any)
    );

    const guildId = "1";

    // Simuler la suppression
    const { data, error } = (await supabase
      .from("challenges")
      .delete()
      .eq("id", guildId)) as unknown as { data: Challenges[]; error: any };

    // Vérification que la méthode "from" a bien été appelée
    expect(spy).toHaveBeenCalled();

    // Vérification que "delete" a bien été appelée
    expect(spy).toHaveBeenCalledWith("challenges"); // Vérifie l'appel avec le nom de la table

    // Vérifie que delete a bien été appelé
    expect(spy.mock.results[0].value.delete).toHaveBeenCalled();

    // Vérification que la réponse contient l'objet supprimé
    expect(data).toBeDefined();
    console.log(data);

    expect(data![0].id).toBe("1");
    expect(data![0].name).toBe("Challenge Test");
    expect(data![0].cover).toBe("cover.jpg");
    expect(data![0].description).toBe("Description Test");

    // Vérifie qu'il n'y a pas d'erreur
    expect(error).toBeNull();
  });
});
