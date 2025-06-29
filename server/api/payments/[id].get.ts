import { defineEventHandler, createError } from "h3";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const id = event.context.params?.id;

  const { data, error } = await client
    .from("payments")
    .select()
    .eq("id", id ?? "");

  if (error) {
    console.error("Error fetching payment", error.message);
    throw createError({ statusCode: 500, message: error.message });
  }

  return data;
});
