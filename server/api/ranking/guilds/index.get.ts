import { serverSupabaseClient } from "#supabase/server";
import { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event);

  try {
    // Récupérer les défis complétés avec les informations sur les utilisateurs, les défis et les guildes
    const { data: completedChallenges, error: challengeError } = await client
      .from("complete_challenges")
      .select("user_id, users(*), challenges(guild, guilds(name))")
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

    // Récupérer les noms des guildes
    const guildIds = Object.keys(guildUserChallengeCounts);
    const { data: guilds, error: guildError } = await client
      .from("guilds")
      .select("id, name")
      .in("id", guildIds);

    if (guildError) {
      throw createError({ statusCode: 500, message: guildError.message });
    }

    // Créer un mapping des guildes pour accéder facilement à leur nom
    const guildMap = guilds.reduce((acc, guild) => {
      acc[guild.id] = guild.name;
      return acc;
    }, {} as { [key: string]: string });

    // Trier les utilisateurs par nombre de défis complétés dans chaque guilde
    const sortedGuildUsers = Object.entries(guildUserChallengeCounts).map(
      ([guild, userCounts]) => {
        const sortedUsers = Object.entries(userCounts)
          .map(([user_id, completed_count]) => ({ user_id, completed_count }))
          .sort((a, b) => b.completed_count - a.completed_count);

        return {
          guild,
          guild_name: guildMap[guild] || "Unknown Guild", // Ajouter le nom de la guilde
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
    return createError({ statusCode: 500, message: "Internal Server Error" });
  }
});
