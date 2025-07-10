import { defineEventHandler, createError } from "h3";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);

  const { data, error } = await client.from("teachers").select(
    `*, teachers_behavioral_issues(id, date, description),
      teachers_loans(id,date,amount),
      teachers_absence(id, date, reason, excuse_status),
      academic_classes:teachers_academic_classes(class:academic_classes(title, group))`
  );
  // .order("full_name", { ascending: true });
  if (error) {
    console.error("Error fetching teachers:", error.message);
    throw createError({ statusCode: 500, message: error.message });
  }

  return data;
});
