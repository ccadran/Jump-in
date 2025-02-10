// supabaseClient.ts
import { createClient } from "@supabase/supabase-js";
import type { Database } from "~/types/supabase";

export const createSupabaseClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_KEY!;
  return createClient<Database>(supabaseUrl, supabaseKey);
};
