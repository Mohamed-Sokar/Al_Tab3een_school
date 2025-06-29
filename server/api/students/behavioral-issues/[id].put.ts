import { defineEventHandler, readBody, createError } from "h3";
import { serverSupabaseClient } from "#supabase/server";
import { BehavioralIssue } from "~/types";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const id = getRouterParam(event, "id");
  const updates: BehavioralIssue = await readBody(event);

  const { data, error } = await client
    .from("students_behavioral_issues")
    .update(updates)
    .eq("id", id ?? "")
    .select();

  if (error) {
    throw createError({ statusCode: 500, message: error.message });
  }

  return data;
});
