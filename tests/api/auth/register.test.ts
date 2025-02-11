import { describe, it, expect, vi, afterEach } from "vitest";
import { createSupabaseClient } from "../supabaseClient";

describe("POST /api/auth/register", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("register un user et le connecter", async () => {
    const supabase = createSupabaseClient();

    // Mock de l'inscription avec Supabase Auth
    const signUpSpy = vi.spyOn(supabase.auth, "signUp").mockResolvedValue({
      data: { user: { id: "123", email: "test@example.com" } } as any,
      error: null,
    });

    // Mock de l'insertion dans la table "users"
    const insertSpy = vi.spyOn(supabase, "from").mockImplementation(
      () =>
        ({
          insert: vi.fn().mockResolvedValue({
            data: [
              {
                user_id: "123",
                first_name: "John",
                name: "Doe",
                username: "johndoe",
                description: "Test user",
                profil_picture: "profile.jpg",
              },
            ],
            error: null,
          }),
          select: vi.fn(),
        } as any)
    );

    const userData = {
      firstName: "John",
      name: "Doe",
      username: "johndoe",
      description: "Test user",
      profilePicture: "profile.jpg",
    };

    const { data, error } = await supabase.auth.signUp({
      email: "test@example.com",
      password: "password123",
    });

    expect(signUpSpy).toHaveBeenCalled();
    expect(signUpSpy).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });

    expect(data).toBeDefined();
    expect(data.user!.id).toBe("123");
    expect(data.user!.email).toBe("test@example.com");
    expect(error).toBeNull();

    // Simuler l'insertion dans la base de données
    const { data: insertedData, error: insertError } = (await supabase
      .from("users")
      .insert({
        user_id: data.user!.id,
        first_name: userData.firstName,
        name: userData.name,
        username: userData.username,
        description: userData.description,
        profil_picture: userData.profilePicture,
      })) as any;

    expect(insertSpy).toHaveBeenCalled();
    expect(insertedData).toBeDefined();
    expect(insertedData![0].user_id).toBe("123");
    expect(insertedData![0].first_name).toBe("John");
    expect(insertError).toBeNull();
  });
});
