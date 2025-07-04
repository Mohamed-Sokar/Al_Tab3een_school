import { d as defineEventHandler, r as readBody, c as createError } from '../../../nitro/nitro.mjs';
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

const deleteMany_delete = defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const { ids } = await readBody(event);
  if (!Array.isArray(ids) || ids.length === 0) {
    throw createError({ statusCode: 400, message: "No student IDs provided." });
  }
  const { data, error } = await client.from("students").delete().in("id", ids);
  if (error) {
    throw createError({ statusCode: 500, message: error.message });
  }
  return { success: true, deleted: data };
});

export { deleteMany_delete as default };
//# sourceMappingURL=delete-many.delete.mjs.map
