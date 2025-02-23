import { serverSupabaseClient } from "#supabase/server";
import { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, "user_id") as string;
  const client = await serverSupabaseClient<Database>(event);

  const { data, error } = await client
    .from("user_guilds")
    .select("guilds(*)")
    .eq("user_id", userId);

  if (error) {
    return createError({ statusCode: 500, message: error.message });
  }
  const guilds = data.map((item) => item.guilds);

  return guilds;
});
