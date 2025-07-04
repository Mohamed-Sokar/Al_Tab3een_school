import { d as defineEventHandler, c as createError } from '../../nitro/nitro.mjs';
import { s as serverSupabaseClient } from '../../_/serverSupabaseClient.mjs';
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

const index_get = defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const { data, error } = await client.from("students").select(
    "*, behavioral_issues:students_behavioral_issues(id, date, description),academic_class:academic_classes(id,title,group,floor,wing),quran_class:quran_classes(id,title,group,floor,wing),driver:drivers(name, car_type, car_color, phone_no)"
  ).order("full_name", { ascending: true });
  if (error) {
    console.error("Error fetching students:", error.message);
    throw createError({ statusCode: 500, message: error.message });
  }
  return data;
});

export { index_get as default };
//# sourceMappingURL=index.get6.mjs.map
