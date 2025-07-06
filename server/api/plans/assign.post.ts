// server/api/plans/assign.ts
import { defineEventHandler, readBody } from "h3";
import { serverSupabaseClient } from "#supabase/server";
import { Student } from "~/types";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);

  const { studentIds, planId } = await readBody(event);

  if (!Array.isArray(studentIds) || typeof planId !== "number") {
    return {
      success: false,
      message: "بيانات غير صحيحة",
    };
  }

  const { data, error } = await client
    .from("students")
    .update({ plan_id: planId })
    .in("id", studentIds)
    .select();

  if (error) {
    // return { success: false, error };
    throw createError({ statusCode: 500, message: error.message });
  }

  // return { success: true, data };
  return data;
});
