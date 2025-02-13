// server/api/auth/login.post.ts
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);

  const client = await serverSupabaseClient(event);

  try {
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });
    console.log("____login", data);
    console.log("____login", error);

    if (error) throw error;

    return { data };
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      message: error.message,
    });
  }
});
