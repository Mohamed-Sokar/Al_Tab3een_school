import { defineEventHandler, createError } from "h3";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);

  const { data, error } = await client
    .from("employees_behavioral_issues")
    .select("*, employee:employees(first_name, last_name)")
    .order("created_at", { ascending: true });
  if (error) {
    console.error("Error fetching employeees:", error.message);
    throw createError({ statusCode: 500, message: error.message });
  }

  return data;
});
