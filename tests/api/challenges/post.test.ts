import { describe, it, expect, vi, afterEach } from "vitest";
import { createSupabaseClient } from "../supabaseClient";

describe("POST /api/challenges", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("ajouter un nouveau challenge (simulé)", async () => {
    const supabase = createSupabaseClient();

    const spy = vi.spyOn(supabase, "from").mockImplementation(
      () =>
        ({
          insert: vi.fn().mockResolvedValue({
            data: [
              {
                name: "challenge Test",
                cover: "cover.jpg",
                description: "Description Test",
              },
            ],
            error: null,
          }),
          select: vi.fn(),
        } as any)
    );

    const { data, error } = await supabase.from("challenges").insert({
      name: "challenge Test",
      cover: "cover.jpg",
      description: "Description Test",
    });

    expect(spy).toHaveBeenCalled();
    expect(data).toBeDefined();
    expect(error).toBeNull();
  });
});
