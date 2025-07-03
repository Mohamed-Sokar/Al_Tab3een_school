import { defineEventHandler, readBody, createError } from "h3";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const body = await readBody(event);

  const { studentIds, driverId } = body;

  if (!Array.isArray(studentIds) || !driverId) {
    throw createError({
      statusCode: 400,
      message: "studentIds array and driverId are required",
    });
  }

  const { data, error } = await client
    .from("students")
    .update({ driver_id: driverId })
    .in("id", studentIds);

  if (error) {
    throw createError({ statusCode: 500, message: error.message });
  }

  return { success: true, updated: data };
});
