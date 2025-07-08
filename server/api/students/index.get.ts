import { defineEventHandler, createError } from "h3";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);

  const { data, error } = await client
    .from("students")
    .select(
      `*, behavioral_issues:students_behavioral_issues(id, date, description),
      academic_class:academic_classes(id,title,group,floor,wing),
      quran_class:quran_classes(id,title,group,floor,wing),
      driver:drivers(name, car_type, car_color, phone_no),
      plan:plans(year,semester,stage,total_pages, months_plans(id,month, pages, plan_id)),
      quran_achievement_reports:students_quran_achievement_reports(monthly_plan_id,month,achieved_pages,status)`
    )
    // .eq("id", "0630f76b-c80f-48f0-b3b2-55392f60e2e4");
    .order("full_name", { ascending: true });
  if (error) {
    throw createError({ statusCode: 500, message: error.message });
  }

  return data;
});
