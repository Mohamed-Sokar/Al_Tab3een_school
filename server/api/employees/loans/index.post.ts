import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const body = await readBody(event);

  // const parsed = schema.safeParse(body);
  // if (!parsed.success) {
  //   throw createError({
  //     statusCode: 400,
  //     message: "Invalid data",
  //   });
  // }

  // const { student_id, date, description, level, class_group, student_name } =
  //   parsed.data;

  const { data, error } = await client
    .from("teachers_loans")
    .insert(body)
    .select();

  if (error) {
    throw createError({ statusCode: 500, message: error.message });
  }

  return data;
});
