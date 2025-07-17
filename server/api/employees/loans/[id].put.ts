import { defineEventHandler, readBody, createError } from "h3";
import { serverSupabaseClient } from "#supabase/server";
import { TeacherLoan } from "~/types";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const id = getRouterParam(event, "id");
  const updates = await readBody<TeacherLoan>(event);

  const { data, error } = await client
    .from("employees_loans")
    .update(updates)
    .eq("id", id ?? "")
    .select();

  if (error) {
    throw createError({ statusCode: 500, message: error.message });
  }

  return data;
});
