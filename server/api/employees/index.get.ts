import { defineEventHandler, createError } from "h3";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);

  const { data, error } = await client.from("employees").select(
    `*, behavioral_issues:employees_behavioral_issues(id, description,created_at),
      loans:employees_loans(id,amount,created_at),
      absence:employees_absence(id, date, reason, excuse_status),
      academic_classes:teachers_academic_classes(class:academic_classes(id,title, group)),
      supervisory_visits(notes,date,supervisor,type),
      salaries:employee_salaries(*)
      `
  );
  // .order("full_name", { ascending: true });
  if (error) {
    console.error("Error fetching employees:", error.message);
    throw createError({ statusCode: 500, message: error.message });
  }

  return data;
});
