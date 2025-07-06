import { defineEventHandler, readBody, createError, getRouterParam } from "h3";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);

  const id = getRouterParam(event, "id");
  const updates = await readBody(event);

  const { data, error } = await client
    .from("months_plans")
    .update(updates)
    .eq("id", Number(id)) // 👈 تأكد أنها رقم
    .select();

  if (error) {
    console.error("Error updating plan:", error.message);
    s;
    throw createError({ statusCode: 500, message: error.message });
  }

  return data;
});
