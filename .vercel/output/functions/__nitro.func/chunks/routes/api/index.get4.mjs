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
  const { data, error } = await client.from("payments").select();
  if (error) {
    console.error("Error fetching payments", error.message);
    throw createError({ statusCode: 500, message: error.message });
  }
  return data;
});

export { index_get as default };
//# sourceMappingURL=index.get4.mjs.map
