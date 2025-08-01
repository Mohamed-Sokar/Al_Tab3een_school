import { defineEventHandler, createError } from "h3";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);

  const { data, error } = await client
    .from("students_behavioral_issues")
    .select(
      "*, student:students(first_name, last_name, class:academic_classes(title,group))"
    );
  // .order("student_name", { ascending: true });
  if (error) {
    console.error("Error fetching students:", error.message);
    throw createError({ statusCode: 500, message: error.message });
  }

  return data;
});
