import { defineEventHandler, createError } from "h3";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);

  const { data, error } = await client.from("academic_classes").select();

  if (error) {
    throw createError({ statusCode: 500, message: error.message });
  }

  return data;
});
