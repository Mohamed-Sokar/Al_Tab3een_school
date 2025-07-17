// server/api/add-behavioral-issue.post.ts
import { serverSupabaseClient } from "#supabase/server";
// import { z } from "zod";

// const schema = z.object({
//   student_id: z.string(),
//   date: z.string(), // ISO string, or format as needed
//   description: z.string(),
//   level: z.string(),
//   class_group: z.string(),
//   student_name: z.string(),
// });

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
    .from("employees_behavioral_issues")
    .insert(body)
    .select();

  if (error) {
    throw createError({ statusCode: 500, message: error.message });
  }

  return data;
});
