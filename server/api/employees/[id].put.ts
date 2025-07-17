import { defineEventHandler, readBody, createError } from "h3";
import { serverSupabaseClient } from "#supabase/server";
import { Student, Teacher } from "~/types";

export default defineEventHandler(async (event) => {
  type TeacherUpdate = Omit<Teacher, "id" | "created_at" | "manager_id">;

  const client = await serverSupabaseClient(event);
  const id = getRouterParam(event, "id");
  const updates = await readBody<TeacherUpdate>(event);

  const { data, error } = await client
    .from("employees")
    .update(updates)
    .eq("id", id ?? "")
    .select();

  if (error) {
    throw createError({ statusCode: 500, message: error.message });
  }

  return data;
});
