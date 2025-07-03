import { defineEventHandler, createError } from "h3";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);

  const { data, error } = await client
    .from("students")
    .select(
      "*, behavioral_issues:students_behavioral_issues(id, date, description),academic_class:academic_classes(id,title,group,floor,wing),quran_class:quran_classes(id,title,group,floor,wing),driver:drivers(name, car_type, car_color, phone_no)"
    )
    .order("full_name", { ascending: true });
  if (error) {
    console.error("Error fetching students:", error.message);
    throw createError({ statusCode: 500, message: error.message });
  }

  return data;
});
