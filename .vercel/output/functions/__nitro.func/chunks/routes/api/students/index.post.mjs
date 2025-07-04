import { d as defineEventHandler, r as readBody, c as createError } from '../../../nitro/nitro.mjs';
import { z } from 'zod';
import { s as serverSupabaseClient } from '../../../_/serverSupabaseClient.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@iconify/utils';
import 'consola';
import 'node:module';
import '@supabase/ssr';

const schema = z.object({
  student_id: z.string(),
  date: z.string(),
  // ISO string, or format as needed
  description: z.string(),
  level: z.string(),
  class_group: z.string(),
  student_name: z.string()
});
const index_post = defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const body = await readBody(event);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: "Invalid data"
    });
  }
  const { student_id, date, description, level, class_group, student_name } = parsed.data;
  const { data, error } = await client.from("students_behavioral_issues").insert([
    {
      student_id,
      date,
      description,
      level,
      class_group,
      student_name
    }
  ]).select();
  if (error) {
    throw createError({ statusCode: 500, message: error.message });
  }
  return data;
});

export { index_post as default };
//# sourceMappingURL=index.post.mjs.map
