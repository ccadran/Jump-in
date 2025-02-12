import { describe, it, expect, vi, afterEach } from "vitest";
import { createSupabaseClient } from "../supabaseClient";

describe("GET /api/challenges/completed", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("récupère les utilisateurs avec le nombre de challenges complétés et les enrichit", async () => {
    const supabase = createSupabaseClient();

    const mockCompletedChallengesData = {
      data: [
        {
          user_id: "user1",
          users: { id: "user1", name: "User One" },
        },
        {
          user_id: "user2",
          users: { id: "user2", name: "User Two" },
        },
        {
          user_id: "user1",
          users: { id: "user1", name: "User One" },
        },
      ],
      error: null,
    };

    // Simulation de la chaîne complète
    const mockSelect = vi.fn().mockReturnThis();
    const mockNot = vi.fn().mockResolvedValue(mockCompletedChallengesData);

    const spy = vi.spyOn(supabase, "from").mockImplementation(
      () =>
        ({
          select: mockSelect,
          not: mockNot,
        } as any)
    );

    // Simuler l'appel à la route avec les données de challenges complétés
    const { data: completedChallenges, error } = await supabase
      .from("complete_challenges")
      .select("user_id, users(*)")
      .not("user_id", "is", null);

    expect(spy).toHaveBeenCalled();
    expect(mockSelect).toHaveBeenCalledWith("user_id, users(*)");
    expect(mockNot).toHaveBeenCalledWith("user_id", "is", null);

    expect(completedChallenges).toBeDefined();
    expect(completedChallenges!.length).toBe(3);

    // Calculer le nombre de challenges complétés par utilisateur
    const userChallengeCounts = mockCompletedChallengesData.data.reduce(
      (acc: { [key: string]: number }, { user_id }) => {
        if (user_id !== null) {
          acc[user_id] = (acc[user_id] || 0) + 1;
        }
        return acc;
      },
      {}
    );

    // Trier les utilisateurs en fonction du nombre de challenges complétés
    const sortedUsers = Object.entries(userChallengeCounts)
      .map(([user_id, completed_count]) => ({ user_id, completed_count }))
      .sort((a, b) => b.completed_count - a.completed_count);

    // Enrichir les utilisateurs avec le nombre de challenges complétés
    const enrichedUsers = sortedUsers
      .map((sortedUser) => {
        const user = mockCompletedChallengesData.data.find(
          (c) => c.user_id === sortedUser.user_id
        )?.users;
        return user
          ? { ...user, challenges_completed: sortedUser.completed_count }
          : null;
      })
      .filter(Boolean);

    expect(enrichedUsers).toBeDefined();
    expect(enrichedUsers!.length).toBe(2);
    expect(enrichedUsers![0]).toEqual({
      id: "user1",
      name: "User One",
      challenges_completed: 2,
    });
    expect(enrichedUsers![1]).toEqual({
      id: "user2",
      name: "User Two",
      challenges_completed: 1,
    });

    expect(error).toBeNull();
  });
});
