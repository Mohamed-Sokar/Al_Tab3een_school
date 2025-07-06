import { defineEventHandler, createError } from "h3";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const id = event.context.params?.id;

  const { data, error } = await client
    .from("months_plans")
    .delete()
    .eq("id", Number(id) ?? 0)
    .select();

  if (error) {
    throw createError({ statusCode: 500, message: error.message });
  }

  return data;
});
