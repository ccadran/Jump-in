import { serverSupabaseClient } from "#supabase/server";
import { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event);

  try {
    // Récupérer les défis complétés avec les informations sur les utilisateurs et les défis
    const { data: completedChallenges, error: challengeError } = await client
      .from("complete_challenges")
      .select("user_id, users(*), challenges(guild)")
      .not("user_id", "is", null);

    if (challengeError) {
      throw createError({ statusCode: 500, message: challengeError.message });
    }

    // Regrouper les défis complétés par guilde et par utilisateur
    const guildUserChallengeCounts = completedChallenges.reduce(
      (
        acc: { [key: string]: { [key: string]: number } },
        { user_id, challenges }
      ) => {
        if (user_id !== null && challenges && challenges.guild) {
          const guildId = challenges.guild;
          acc[guildId] = acc[guildId] || {};
          acc[guildId][user_id] = (acc[guildId][user_id] || 0) + 1;
        }
        return acc;
      },
      {}
    );

    // Trier les utilisateurs par nombre de défis complétés dans chaque guilde
    const sortedGuildUsers = Object.entries(guildUserChallengeCounts).map(
      ([guild, userCounts]) => {
        const sortedUsers = Object.entries(userCounts)
          .map(([user_id, completed_count]) => ({ user_id, completed_count }))
          .sort((a, b) => b.completed_count - a.completed_count);

        return {
          guild,
          users: sortedUsers
            .map((sortedUser) => {
              const user = completedChallenges.find(
                (c) => c.user_id === sortedUser.user_id
              )?.users;
              return user
                ? { ...user, challenges_completed: sortedUser.completed_count }
                : null;
            })
            .filter(Boolean),
        };
      }
    );

    return sortedGuildUsers;
  } catch (error) {
    console.error("Error in API route:", error);
    return createError({ statusCode: 500, message: "Internal Server Error" });
  }
});
