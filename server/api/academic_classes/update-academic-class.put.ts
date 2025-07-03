import { defineEventHandler, readBody, createError } from "h3";
import { serverSupabaseClient } from "#supabase/server";
import { number } from "zod/v4";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const body = await readBody(event);

  const { studentIds, classId } = body;

  if (!Array.isArray(studentIds) || !classId) {
    throw createError({
      statusCode: 400,
      message: "studentIds array and classId are required",
    });
  }

  const { data, error } = await client
    .from("students")
    .update({ academic_class_id: classId })
    .in("id", studentIds);

  if (error) {
    throw createError({ statusCode: 500, message: error.message });
  }

  return { success: true, updated: data };
});
