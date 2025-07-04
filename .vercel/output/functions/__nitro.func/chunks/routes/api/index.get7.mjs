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
  const { data, error } = await client.from("teachers").select(
    "*, teachers_behavioral_issues(id, date, description), teachers_loans(id,date,amount), teachers_absence(id, date, reason, excuse_status)"
  );
  if (error) {
    console.error("Error fetching teachers:", error.message);
    throw createError({ statusCode: 500, message: error.message });
  }
  return data;
});

export { index_get as default };
//# sourceMappingURL=index.get7.mjs.map
