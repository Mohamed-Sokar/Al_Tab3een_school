import { defineEventHandler, createError } from "h3";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);

  const { data, error } = await client
    .from("supervisory_visits")
    .select("*, employee:employees(first_name, last_name)");
  // .order("date", { ascending: true });
  if (error) {
    console.error("Error fetching employees:", error.message);
    throw createError({ statusCode: 500, message: error.message });
  }

  return data;
});
