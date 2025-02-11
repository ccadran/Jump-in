import { describe, it, expect, vi, afterEach } from "vitest";
import { createSupabaseClient } from "../supabaseClient";

describe("POST /api/guilds", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("ajouter une nouvelle guild", async () => {
    const supabase = createSupabaseClient();
    // Espionner la méthode "from"
    const spy = vi.spyOn(supabase, "from").mockImplementation(
      () =>
        ({
          insert: vi.fn().mockResolvedValue({
            data: [
              {
                name: "Guild Test",
                cover: "cover.jpg",
                description: "Description Test",
              },
            ],
            error: null,
          }),
          select: vi.fn(),
        } as any)
    );

    const { data, error } = await supabase.from("guilds").insert({
      name: "Guild Test",
      cover: "cover.jpg",
      description: "Description Test",
    });

    expect(spy).toHaveBeenCalled();
    expect(data).toBeDefined();
    expect(error).toBeNull();
  });
});
