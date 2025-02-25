import { serverSupabaseClient } from "#supabase/server";
import { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event);

  // Récupérer l'ID de la guilde depuis les paramètres de la requête
  const guildId = getRouterParam(event, "id");

  if (!guildId) {
    throw createError({ statusCode: 400, message: "Guild ID is required" });
  }

  try {
    const { data: completedChallenges, error: challengeError } = await client
      .from("complete_challenges")
      .select("user_id, users(*), challenges(guild)")
      .not("user_id", "is", null)
      .eq("challenges.guild", guildId);

    if (challengeError) {
      throw createError({ statusCode: 500, message: challengeError.message });
    }

    const userChallengeCounts = completedChallenges.reduce(
      (acc: { [key: string]: number }, { user_id }) => {
        if (user_id !== null) {
          acc[user_id] = (acc[user_id] || 0) + 1;
        }
        return acc;
      },
      {}
    );

    const sortedUsers = Object.entries(userChallengeCounts)
      .map(([user_id, completed_count]) => ({ user_id, completed_count }))
      .sort((a, b) => b.completed_count - a.completed_count)
      .map((sortedUser) => {
        const user = completedChallenges.find(
          (c) => c.user_id === sortedUser.user_id
        )?.users;
        return user
          ? { ...user, challenges_completed: sortedUser.completed_count }
          : null;
      })
      .filter(Boolean);

    return {
      users: sortedUsers,
    };
  } catch (error) {
    return createError({ statusCode: 500, message: "Internal Server Error" });
  }
});
