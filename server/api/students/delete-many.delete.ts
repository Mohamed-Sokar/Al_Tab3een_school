import { defineEventHandler, readBody, createError } from "h3";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const { ids } = await readBody(event); // array of student IDs

  if (!Array.isArray(ids) || ids.length === 0) {
    throw createError({ statusCode: 400, message: "No student IDs provided." });
  }

  const { data, error } = await client.from("students").delete().in("id", ids);

  if (error) {
    throw createError({ statusCode: 500, message: error.message });
  }

  return { success: true, deleted: data };
});
