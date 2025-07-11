import { defineEventHandler, createError } from "h3";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);

  const { data, error } = await client
    .from("teachers_behavioral_issues")
    .select("*, teacher:teachers(first_name, last_name)")
    .order("created_at", { ascending: true });
  if (error) {
    console.error("Error fetching teachers:", error.message);
    throw createError({ statusCode: 500, message: error.message });
  }

  return data;
});
