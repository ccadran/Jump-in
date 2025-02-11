import { describe, it, expect, vi, afterEach } from "vitest";
import { createSupabaseClient } from "../supabaseClient";

describe("POST /api/auth/login", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("connecter un user ", async () => {
    const supabase = createSupabaseClient();

    // Espionner la méthode "auth.signInWithPassword"
    const spy = vi
      .spyOn(supabase.auth, "signInWithPassword")
      .mockResolvedValue({
        data: { user: { id: "123", email: "test@example.com" } } as any,
        error: null,
      });

    const { data, error } = await supabase.auth.signInWithPassword({
      email: "test@example.com",
      password: "password123",
    });

    // Vérifier que signInWithPassword a bien été appelé
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });

    // Vérifier que la réponse contient les données attendues
    expect(data).toBeDefined();
    console.log(data);

    expect(data.user!.id).toBe("123");
    expect(data.user!.email).toBe("test@example.com");

    // Vérifier qu'il n'y a pas d'erreur
    expect(error).toBeNull();
  });
});
